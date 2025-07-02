import { SettingsHelper } from "../helpers/SettingsHelper";

export class SettingsController {
  constructor() {
    this.container = document.getElementById("settings");
    this.form = document.getElementById("settings-form");
    this.opener = document.getElementById("settings-opener");

    this.generateDOM();
    this.listenToEvents();
  }

  // parse settings of SettingsHelper and create UI
  generateDOM() {
    this.form.innerHTML = "";
    for (const groupId in SettingsHelper.settings) {
      const group = SettingsHelper.settings[groupId];

      const titleElement = document.createElement("p");
      titleElement.innerText = group.displayName;
      titleElement.classList.add("form__title");
      this.form.appendChild(titleElement);

      for (const optionId in group.options) {
        const option = group.options[optionId];

        const formSectionElement = document.createElement("div");
        formSectionElement.classList.add("form__section");
        formSectionElement.classList.add("settings-form__section");

        const labelElement = document.createElement("label");
        labelElement.innerText = option.displayName;
        labelElement.classList.add("form__label");

        switch (option.type) {
          case "checkbox":
            const checkboxElement = document.createElement("input");
            checkboxElement.classList.add("form__input");
            checkboxElement.type = "checkbox";
            checkboxElement.checked = SettingsHelper.getOptionValue(
              groupId,
              optionId
            );
            checkboxElement.dataset.groupId = groupId;
            checkboxElement.dataset.optionId = optionId;
            checkboxElement.id = `${groupId}.${optionId}`;
            checkboxElement.onchange = () => {
              const value = checkboxElement.checked;
              SettingsHelper.setOptionValue(groupId, optionId, value);
            };
            if (option.value) {
              checkboxElement.setAttribute("selected", "true");
            }
            labelElement.setAttribute("for", checkboxElement.id);
            formSectionElement.appendChild(checkboxElement);
            formSectionElement.appendChild(labelElement);
            break;
          case "select":
            const selectElement = document.createElement("select");
            selectElement.classList.add("form__select");
            selectElement.dataset.groupId = groupId;
            selectElement.dataset.optionId = optionId;
            selectElement.id = `${groupId}.${optionId}`;
            selectElement.onchange = () => {
              const value = selectElement.value;
              SettingsHelper.setOptionValue(groupId, optionId, value);
            };
            for (const selectOptionValue in option.options) {
              const optionElement = document.createElement("option");
              optionElement.value = selectOptionValue;
              optionElement.innerText = option.options[selectOptionValue];
              if (option.value == selectOptionValue) {
                optionElement.selected = "true";
              }
              selectElement.appendChild(optionElement);
            }
            labelElement.setAttribute("for", selectElement.id);
            formSectionElement.appendChild(labelElement);
            formSectionElement.appendChild(selectElement);
            break;
        }

        this.form.appendChild(formSectionElement);
      }
    }
    const saveButton = document.createElement("button");
    saveButton.classList.add("form__button");
    saveButton.type = "submit";
    saveButton.innerText = "Закрыть";
    saveButton.addEventListener("click", () => {
      this.container.style.display = "none";
      this.opener.classList.remove("active");
    });
    this.form.appendChild(saveButton);
  }

  listenToEvents() {
    this.opener.addEventListener("click", () => {
      if (this.opener.classList.contains("active")) {
        this.container.style.display = "none";
        this.opener.classList.remove("active");
      } else {
        this.generateDOM();
        this.container.style.display = "block";
        this.opener.classList.add("active");
      }
    });
  }
}
