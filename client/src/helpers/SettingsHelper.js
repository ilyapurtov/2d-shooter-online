export class SettingsHelper {
  static settings = {};
  // example setting object
  /*
  groupId: {
    displayName: "group display name",
    options: {
      optionId1: {
        displayName: "option 1",
        type: "checkbox",
        defaultValue: true,
      },
      optionId2: {
        displayName: "option 2",
        type: "select",
        options: {
          optionValue1: "display value 1",
          optionValue2: "display value 2",
        }
        defaultValue: "optionValue1",
      },
    }
  }
  */

  static createSettingGroup(groupId, displayName) {
    this.settings[groupId] = { displayName, options: {} };
    return this;
  }

  static addOption(
    groupId,
    optionId,
    { displayName, type, defaultValue, options = {} }
  ) {
    if (this.settings[groupId]) {
      this.settings[groupId].options[optionId] = {
        displayName,
        type,
        defaultValue,
        value: defaultValue,
        options,
      };
    }
    return this;
  }

  static getOptionValue(groupId, optionId) {
    return this.settings[groupId].options[optionId].value;
  }

  static setOptionValue(groupId, optionId, value) {
    this.settings[groupId].options[optionId].value = value;
  }
}
