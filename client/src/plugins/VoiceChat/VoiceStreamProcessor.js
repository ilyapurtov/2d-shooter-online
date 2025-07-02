// Это кастомный аудио процессор, позволяющий передавать данные
// с увеличенным буфером, чтобы уменьшить нагрузку как на клиент, так и на сервер.
// Чем больше буфер, тем больше задержка звука, но тем меньше запросов обрабатывает сервер
class VoiceStreamProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    // flushSamples - размер буфера, должен быть кратен 128
    this.flushSamples = options.processorOptions.flushSamples;

    // создаем буфер с указанным размером
    this.samples = new Float32Array(this.flushSamples);

    // переменная смещения
    this.offset = 0;
  }

  // метод из родительского класса, который мы переписываем.
  // вызывается когда приходят аудио данные
  process(inputs, outputs, params) {
    // берем данные первого канала первого источника звука
    // (то есть получаем моно звук из микрофона)
    const input = inputs?.[0]?.[0];

    // наполняем буфер полученными данными и увеличиваем переменную смещения
    // на длину дефолтного буфера (обычно 128 сэмплов)
    this.samples.set(input, this.offset);
    this.offset += input.length;

    // если полностью заполнили буфер, отправляем данные и сбрасываем буфер
    if (this.offset == this.flushSamples) {
      this.flush();
    }

    // согласно родительскому классу метод process должен возвращать
    // булевое значение, означающее отсутствие ошибок
    return true;
  }

  // отправляем данные из буфера в port и сбрасываем смещение
  flush() {
    this.port.postMessage(this.samples);
    this.offset = 0;
  }
}

// регистрируем наш кастомный процессор
registerProcessor("voice-stream-processor", VoiceStreamProcessor);
