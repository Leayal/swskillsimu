class Bootstrap4ModalDialogManager {
    constructor() {
        this.modals = [];
        this.callbacks = [];
    }

    Unregister(dialog) {
        var index = this.modals.indexOf(dialog);
        if (index === -1) return;
        this.modals.splice(index, 1);
        // this.modals = this.modals.filter(function (item) { return item !== dialog });
        if (this.modals.length === 0)
            this.callbacks.forEach(function (currentValue, index, arr) {
                currentValue(false);
            });
    }

    Register(dialog) {
        var index = this.modals.indexOf(dialog);
        if (index !== -1) return;
        if (this.modals.length === 0)
            this.callbacks.forEach(function (currentValue, index, arr) {
                currentValue(true);
            });
        this.modals.push(dialog);
    }

    CloseForegroundDialog() {
        if (this.modals.length === 0) return;
        var dialog = this.modals[this.modals.length - 1];
        dialog.Hide();
    }

    CloseAllDialogs() {
        if (this.modals.length === 0) return;
        this.modals.forEach(function (currentValue, index, arr) {
            currentValue.Hide();
        });
    }

    OnModalChanged(callback) {
        if (typeof (callback) === "function")
            this.callbacks.push(callback);
    }
}

var DialogManager = new Bootstrap4ModalDialogManager();

class Bootstrap4ModalDialog {
    constructor(parent, content, title, buttons) {
        if (!content) {
            throw "Dialog without content is surely something to be seen!??";
            return;
        }
        this.objState = {};
        this.parent = parent;
        var contentType = typeof (content);
        if (contentType === "string")
            this.dialogContent = $("<div>").addClass("modal-body").text(content);
        else if (contentType === "function")
            this.dialogContent = $("<div>").addClass("modal-body").append(content(this));
        else
            this.dialogContent = $("<div>").addClass("modal-body").append(content);
        this.callbacks = [];
        var self = this;
        if (!buttons) {
            this.dialogButtons = $("<div>").addClass("modal-footer").append(
                $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("OK").click(function (e) {
                    self.result = 1;
                })
            );
        } else {
            var buttonsType = typeof (buttons);
            if (buttonsType === "number") {
                switch (buttons) {
                    case Bootstrap4ModalDialog.ButtonsOK:
                        this.dialogButtons = $("<div>").addClass("modal-footer").append(
                            $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("OK").click(function (e) {
                                self.result = 1;
                            })
                        );
                        break;
                    case Bootstrap4ModalDialog.ButtonsClose:
                        this.dialogButtons = $("<div>").addClass("modal-footer").append(
                            $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("Close").click(function (e) {
                                self.result = 1;
                            })
                        );
                        break;
                    case Bootstrap4ModalDialog.ButtonsYesNo:
                        this.dialogButtons = $("<div>").addClass("modal-footer").append(
                            $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("Yes").click(function (e) {
                                self.result = 1;
                            }), [
                                $("<button>").addClass("btn btn-secondary").attr({ "type": "button", "modal-IsCancel": "true", "data-dismiss": "modal" }).text("No")
                            ]
                        );
                        break;
                    case Bootstrap4ModalDialog.ButtonsYesNoDanger:
                        this.dialogButtons = $("<div>").addClass("modal-footer").append(
                            $("<button>").addClass("btn btn-danger").attr({ "type": "button", "modal-IsDefault": "true" }).text("Yes").click(function (e) {
                                self.result = 1;
                            }), [
                                $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsCancel": "true", "data-dismiss": "modal" }).text("No")
                            ]
                        );
                        break;
                }
            } else if (buttonsType === "object" && buttons.length && buttons.length > 0) {
                this.dialogButtons = $("<div>").addClass("modal-footer");
                var btn;
                buttons.forEach(function (current, index, arr) {
                    var currentValue = current;
                    btn = $("<button>").attr("type", "button");
                    if (currentValue.cssClass)
                        btn.addClass(currentValue.cssClass);
                    if (currentValue.label)
                        btn.text(currentValue.label);
                    if (typeof (currentValue.action) === "function") {
                        btn.click(function (e) {
                            e.stopPropagation();
                            currentValue.action(self);
                        });
                    } else {
                        btn.click(function (e) {
                            e.stopPropagation();
                        });
                    }
                    this.append(btn);
                }, this.dialogButtons);
            }
        }
        if (!title)
            title = "Dialog";
        this.dialogHeader = $("<div>").addClass("modal-header").append(
            $("<h5>").addClass("modal-title").text(title), [
                $("<button>").addClass("close").attr({ "role": "button", "aria-label": "Close", "data-dismiss": "modal" }).append(
                    $("<span>").attr("aria-hidden", "true").html("&times;")
                )
            ]
        );
        this.dialog = $("<div>").addClass("modal fade").attr({ "tabindex": "-1", "role": "dialog", "aria-labelledby": "ModalLabel", "aria-hidden": "true", "data-backdrop": "false" }).append(
            $("<div>").addClass("modal-dialog modal-dialog-centered").attr("role", "document").append(
                $("<div>").addClass("modal-content bg-dark").append(
                    this.dialogHeader, [this.dialogContent, this.dialogButtons]
                ).click(function (e) {
                    if (!e.target)
                        e.stopPropagation();
                    else {
                        var element = $(e.target);
                        if (element.is("button") || element.is("a") || element.hasClass("clickable")) { } else {
                            e.stopPropagation();
                        }
                    }
                }).draggable({
                    handle: ".modal-header",
                    containment: parent
                })
            )
        );
    }

    SetData(key, data) {
        this.objState[key] = data;
    }

    GetData(key) {
        return this.objState[key];
    }

    Show(target) {
        var myself = this;
        if (!target) {
            this.parent.append(this.dialog);
        } else {
            target.append(this.dialog);
        }
        this.dialog.on("hidden.bs.modal", function (e) {
            window.DialogManager.Unregister(myself);
            myself.TriggerCallback();
            myself.Dispose();
        });
        this.dialog.on("show.bs.modal", function (e) {
            window.DialogManager.Register(myself);
        });
        this.dialog.modal();
    }

    RegisterCallback(callback) {
        if (typeof (callback) === "function")
            this.callbacks.push(callback);
    }

    TriggerCallback() {
        if (this.callbacks.length === 0) return;
        this.callbacks.forEach(function (currentValue, index, arr) {
            currentValue(this, this.result);
        }, this);
    }

    Hide() {
        this.dialog.modal('hide');
    }

    // CSHARP!!!!! Joke.
    Dispose() {
        this.dialog.modal('dispose');
        this.dialog.empty();
        this.dialog.detach();
    }
}

Bootstrap4ModalDialog.ButtonsOK = 0;
Bootstrap4ModalDialog.ButtonsClose = 1;
Bootstrap4ModalDialog.ButtonsYesNo = 2;
Bootstrap4ModalDialog.ButtonsYesNoDanger = 3;