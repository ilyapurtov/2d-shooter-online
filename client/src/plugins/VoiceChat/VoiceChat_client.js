import voiceProcessorUrl from "./VoiceStreamProcessor.js?url";
import { ClientPlugin } from "../ClientPlugin";
import { EventHelper } from "../../helpers/EventHelper";
import { SettingsHelper } from "../../helpers/SettingsHelper";
import { PlayerController } from "../../controllers/PlayerController";
import pako from "pako";

export class VoiceChat extends ClientPlugin {
  constructor(className, socket) {
    super(className, socket);
  }

  // Этот метод вызывается из родительского класса, когда плагин
  // синхронизировался с сервером и имеет доступ к своей конфигурации
  onLoad() {
    // Создаём пользовательские настройки с помощью вспомогательного
    // класса SettingsHelper и его статических методов
    SettingsHelper.createSettingGroup(
      this.className,
      "Настройки голосового чата"
    )
      .addOption(this.className, "enabled", {
        displayName: "Включить?",
        type: "checkbox",
        defaultValue: true,
      })
      .addOption(this.className, "mic_activation", {
        displayName: "Активация микрофона",
        type: "select",
        options: {
          keydown: "По кнопке (Z)",
          //active: "Всегда активен",
          disabled: "Выключен",
        },
        defaultValue: "keydown",
      });

    // активен ли микрофон
    this.micActive = this.getUserMicActivation() == "active";

    // подгружаем иконку активного микрофона
    this.micActiveImage = new Image();
    this.micActiveImage.src = "/icons/mic.png";

    // слушаем события на клиенте
    this.listenToClientEvents();

    // инициализируем работу с аудио, а затем слушаем серверные события
    this.initAudio().then(() => this.listenToServerEvents());
  }

  // Этот метод создает аудио контекст, получает звук микрофона пользователя
  // а также настраивает передачу звука чанками на сервер
  async initAudio() {
    try {
      // создаем аудио контекст для продвинутой работы с аудио
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)({
        sampleRate: this.pluginConfig.sampleRate,
      });

      // добавляем модуль кастомного аудио процессора для отправки
      // данных на сервер чанками
      await this.audioContext.audioWorklet.addModule(voiceProcessorUrl);

      // запрашиваем доступ к микрофону у пользователя
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          autoGainControl: true,
          echoCancellation: false,
          latencyHint: "interactive",
        },
      });

      // создаем источник звука
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(
        this.mediaStream
      );

      // создаем промежуточный узел между входными и выходными данными,
      // для того чтобы в нём обрабатывать входящий сигнал
      this.audioWorkletNode = new AudioWorkletNode(
        this.audioContext,
        "voice-stream-processor",
        {
          processorOptions: {
            // передаем конфигурационные данные плагина, пришедшие с сервера,
            // в кастомный аудио процессор
            flushSamples: this.pluginConfig.flushSamples,
          },
        }
      );

      // когда аудио процессор отправляет данные, перехватываем их
      // с помощью события onmessage и отправляем на сервер в виде массива
      this.audioWorkletNode.port.onmessage = (event) => {
        const data = event.data;
        if (this.micActive) {
          const compressed = pako.deflate(JSON.stringify(Array.from(data)));
          this.socket.emit("VoiceChat.audioStream", compressed);
        }
      };

      // подключаем источник звука микрофона к созданному узлу
      this.mediaStreamSource.connect(this.audioWorkletNode);
    } catch (err) {
      console.error("Не удалось запустить войс чат: ", err);
    }
  }

  // возвращает true или false в зависимости от того включен ли войс чат
  getUserVoiceChatEnabled() {
    return SettingsHelper.getOptionValue(this.className, "enabled");
  }

  // возвращает тип активации микрофона у пользователя
  getUserMicActivation() {
    return SettingsHelper.getOptionValue(this.className, "mic_activation");
  }

  // этот метод слушает события на клиенте
  listenToClientEvents() {
    EventHelper.addEventListener("game.keydown", (event) => {
      if (
        event.code == "KeyZ" &&
        this.getUserVoiceChatEnabled() &&
        this.getUserMicActivation() == "keydown"
      ) {
        this.micActive = true;
        this.socket.emit(`${this.className}.audioStreamStart`);
      }
    });
    EventHelper.addEventListener("game.keyup", (event) => {
      if (
        event.code == "KeyZ" &&
        this.getUserVoiceChatEnabled() &&
        this.getUserMicActivation() == "keydown"
      ) {
        this.micActive = false;
        this.socket.emit(`${this.className}.audioStreamEnd`);
      }
    });
    EventHelper.addEventListener("game.player.render", ({ ctx, player }) => {
      if (player.micActive) {
        ctx.filter = "invert()";
        ctx.drawImage(
          this.micActiveImage,
          player.x + player.width / 2 - 9,
          player.y - 60,
          18,
          18
        );
        ctx.filter = "none";
      }
    });
  }

  // этот метод слушает события сервера
  listenToServerEvents() {
    // когда нам приходит звук микрофона какого-то другого пользователя
    this.socket.on(`${this.className}.audioStream`, (stream) => {
      // если войс чат отключен, выходим из функции
      if (!this.getUserVoiceChatEnabled()) {
        return;
      }

      const decompressed = pako.inflate(stream, { to: "string" });
      const rawData = JSON.parse(decompressed);

      // создаем моно аудио-буфер
      const audioBuffer = this.audioContext.createBuffer(
        1,
        rawData.length,
        this.audioContext.sampleRate
      );
      // берем данные из первого и единственного аудио канала
      const channelData = audioBuffer.getChannelData(0);

      // проходимся по входным данным и записываем в буфер
      for (let i = 0; i < rawData.length; i++) {
        channelData[i] = rawData[i];
      }

      // создаем источник звука из полученного буфера
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // подключаем источник звука к наушникам/колонкам пользователя
      source.connect(this.audioContext.destination);
      // включаем проигрывание звука
      source.start();
    });

    this.socket.on(`${this.className}.audioStreamStart`, (socketId) => {
      if (PlayerController.frontendPlayers[socketId])
        PlayerController.frontendPlayers[socketId].micActive = true;
    });

    this.socket.on(`${this.className}.audioStreamEnd`, (socketId) => {
      if (PlayerController.frontendPlayers[socketId])
        PlayerController.frontendPlayers[socketId].micActive = false;
    });
  }
}
