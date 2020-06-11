import { Classes } from "@blueprintjs/core";
import { ITerminalOptions, ITheme, Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

// tslint:disable-next-line: no-submodule-imports
import "xterm/css/xterm.css";

class JobTerminal {
  public _id: string;
  public isOpened: boolean = false;
  private terminal: Terminal;
  public fitAddon: FitAddon;
  private options: ITerminalOptions = {
    convertEol: true,
  };
  private darkTheme: ITheme = {
    background: "#202B33",
    foreground: "#F5F8FA",
  };
  private lightTheme: ITheme = {
    background: "#F5F8FA",
    foreground: "#000000",
    selection: "#73869480",
  };

  private _container: HTMLDivElement = document.createElement("div");

  constructor(_id: string) {
    this._id = _id;
    this.terminal = new Terminal(this.options);
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
  }

  public attachTo(container: HTMLDivElement) {
    this._container = container;
    this.terminal.open(container);
    // this.fitAddon.activate(this.terminal);
    this.fitAddon.fit();
    this.terminal.element?.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (this.terminal.hasSelection()) {
        const copySuccess = document.execCommand("copy");
        if (copySuccess) {
          this.terminal.clearSelection();
        }
      }
    });
    this.terminal.element?.addEventListener("keydown", (e) => {
      e.preventDefault();

      if (!e.ctrlKey && !e.shiftKey) {
        return;
      }

      if (this.terminal.hasSelection() && e.key.toLowerCase() === "c") {
        const copySuccess = document.execCommand("copy");
        if (copySuccess) {
          this.terminal.clearSelection();
        }
      }
    });
  }

  public setTheme(theme: string) {
    if (theme === Classes.DARK) {
      this.terminal.setOption("theme", this.darkTheme);
    } else {
      this.terminal.setOption("theme", this.lightTheme);
    }
  }

  public getTheme() {
    return this.terminal.getOption("theme");
  }

  public removeTheme() {
    this.terminal.setOption("theme", {});
  }

  public resizeTerminal(width: number) {
    this.terminal.resize(Math.floor(width / 10), 20);
  }

  public updateOutput(stdout: string) {
    this.terminal.write(stdout);
  }

  public prompt() {
    this.terminal.write(`\r\n$ `);
  }

  public startInput() {
    this.terminal.write("");
    this.prompt();
  }

  public clear() {
    this.terminal.clear();
  }

  public destroy() {
    this.terminal.dispose();
  }

  public getTerminalInstance(): Terminal {
    return this.terminal;
  }
}

export default JobTerminal;
