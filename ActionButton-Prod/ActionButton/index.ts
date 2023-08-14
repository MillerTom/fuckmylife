import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ButtonControl, { IButtonControlProps } from "./ButtonControl";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { AwayStatusIcon, SettingsIcon } from "@fluentui/react-icons";
// import "twilio";

export class ActionButton
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container: HTMLDivElement;
  private notifyOutputChanged: () => void;
  private currentValue: string | null;
  private actionText: string;
  private mobileNumber: string;
  private message: string;
  private id: string;
  private sendId: boolean;
  private controlType: string;
  /**
   * Empty constructor.
   */
  constructor() {
    initializeIcons();
  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    this.container = container;
    this.notifyOutputChanged = notifyOutputChanged;

    this.actionText = context.parameters.ActionText.raw ?? "";
    this.mobileNumber = context.parameters.MobileNumber.raw ?? "";
    this.message = context.parameters.Message.raw ?? "";
    this.id = context.parameters.Id.raw ?? "";
    this.sendId = context.parameters.SendId.raw === "1";

    // @ts-ignore
    this.controlType = context.parameters.BoundAttribute.attributes.Type;

    if (this.actionText.trim().startsWith("{")) {
      let json = JSON.parse(this.actionText);
      try {
        this.actionText = json[context.userSettings.languageId];
        if (this.actionText === undefined) {
          this.actionText = json[parseInt(Object.keys(json)[0])];
        }
      } catch {
        this.actionText = json[parseInt(Object.keys(json)[0])];
      }
    }

    this.renderControl(context);
  }

  private renderControl(context: ComponentFramework.Context<IInputs>): void {
    let props: IButtonControlProps = {
      text: this.actionText,
      disabled:
        context.parameters.EnableButtonOnDisabledForm.raw === "1"
          ? false
          : context.mode.isControlDisabled,
      style: {
        backgroundColor: context.parameters.BackColor.raw ?? "#0078d4",
        borderColor: context.parameters.BorderColor.raw ?? "#0078d4",
        color: context.parameters.Color.raw ?? "#FFFFFF",
        width: context.parameters.Width.raw ?? "auto",
      },
      hoverBackgroundColor: context.parameters.HoverBackColor.raw ?? "#106EBE",
      hoverBorderColor: context.parameters.HoverBorderColor.raw ?? "#106EBE",
      hoverColor: context.parameters.HoverColor.raw ?? "#FFFFF",
      checkedBackgroundColor:
        context.parameters.PressedBackColor.raw ?? "#0078d4",
      checkedBorderColor:
        context.parameters.PressedBorderColor.raw ?? "#0078d4",
      checkedColor: context.parameters.PressedColor.raw ?? "#FFFFFF",
      iconName: context.parameters.IconName.raw,
      mobileNumber: this.mobileNumber,
      message: this.message,
      onClick: () => {
        if (
          this.mobileNumber !== "" &&
          this.mobileNumber !== null &&
          this.mobileNumber !== "val"
        ) {
          console.log(this.mobileNumber);
          const otp = Math.floor(Math.random() * 100000 + 100000);
          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Basic U0sxNTVkYTUyYWJhNDAyMzJhN2I1YmEzOTU0OWFmODExZTpJb25GTTh5WFNsUXE5TTBNMVBONk51c0w4dWNpc2c0cg==");
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

          var urlencoded = new URLSearchParams();

          urlencoded.append("From", "+19045673798");
          urlencoded.append(
            "MessagingServiceSid",
            "MG91224fcdd01b2a9f3b9da7a187498180"
          );
          urlencoded.append("To", this.mobileNumber);

          urlencoded.append(
            "Body",
            "This message is from d365 and Otp is: " + otp
          );

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
          };

          fetch(
            "https://api.twilio.com/2010-04-01/Accounts/AC2bab2fe55a3dba29a784ca5cb0b4803b/Messages.json",
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => confirm("OTP sent successfully!\n\nOTP-" + otp))
            .catch((error) => alert("error occurred while send OTP!"));
        } else {
          alert("Please provide a mobile number");
        }
      },
    };

    ReactDOM.render(React.createElement(ButtonControl, props), this.container);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.renderControl(context);

    this.currentValue = context.parameters.BoundAttribute.raw ?? "";
    this.mobileNumber = context.parameters.MobileNumber.raw ?? "";
    this.message = context.parameters.Message.raw ?? "";
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    if (this.controlType === "string") {
      return {
        BoundAttribute: this.sendId ? this.id : this.actionText,
      };
    }

    return {
      BoundAttribute: new Date(),
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
