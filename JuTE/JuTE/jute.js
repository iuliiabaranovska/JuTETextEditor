var JuTE = (function () {

    var controlsMarkup = '<div class="jute">' +
                             '<div class="controls">' +
                                  '<span class="simplyButtons">' +
                                      '<button type="button" class="button image"></button>' +
                                  '</span>' +

                                  '<div class="messagepop pop">' +
                                      '<input type="file" class="browsedFile">' +
                                          '<button class="upload">Upload</button>' +
                                      '</input>' +

                                  '</div>' +

                                  '<span class="dropdowns">' +
                                 '</span>' +
                             '</div>' +

                             '<div class="textEditor">' +
                                 '<iframe src="about:blank"></iframe>' +
                                 '<div class="imageContainer">' +
                                 '<span class=".imageRull"><b>Drag image here!<b></span>' +
                                 '</div>' +
                             '</div>' +
                         '</div>';

    function Jute(selector) {

        var controls = [
                new Button("bold"),
                new Button("italic"),
                new Button("createLink"),
                new Button("insertOrderedList"),
                new Button("insertUnorderedList"),
                new Button("undo"),
                new Button("redo"),
                new Button("justifyCenter"),
                new Button("justifyLeft"),
                new Button("justifyRight"),
                new Button("justifyFull")
        ],
            dropdowns = [
                new DropDown("fontName", [{ value: "Fonts", text: "Fonts" },
                                          { value: "Normal", text: "Normal" },
                                          { value: "Arial", text: "Arial" },
                                          { value: "Comic Sans MS", text: "Comic Sans MS" },
                                          { value: "Courier New", text: "Courier New" },
                                          { value: "Monotype Corsiva", text: "Monotype Corsiva" },
                                          { value: "Tahoma New", text: "Tahoma New" },
                                          { value: "Times", text: "Times" },
                                          { value: "Trebuchet New", text: "Trebuchet" }]),

                new DropDown("fontSize", [{ value: "FontSize", text: "Font Size" },
                                          { value: "1", text: "XX-Small" },
                                          { value: "2", text: "X-Small" },
                                          { value: "3", text: "Small" },
                                          { value: "4", text: "Medium" },
                                          { value: "5", text: "Large" },
                                          { value: "6", text: "X-Large" },
                                          { value: "7", text: "XX-Large" }])],

            markupButton = "",
            markupDropdown = "",
            i = 0;

        for (i = 0; i < controls.length; i++) {
            markupButton += controls[i].getMarkup();
        };

        for (i = 0; i < dropdowns.length; i++) {
            markupDropdown += dropdowns[i].getMarkup();
        };


        var $editor = $(selector)
                            .append(controlsMarkup)
                            .find(".simplyButtons")
                                .append(markupButton)
                            .siblings(".dropdowns")
                                .append(markupDropdown)
                                .closest(selector)
                            .find("iframe");

        setTimeout(function () { $editor.contents().prop("designMode", "on"); }, 100); //Firefox issue

        initializeControlsHandlers(selector);
        initializeImageHandler(selector);
        initializeCopyPasteHandler(selector);
    };

    var initializeControlsHandlers = function (selector) {

        var $selector = $(selector),
            $popup = $selector.find(".pop");

        $selector
            .find(".button")
            .on("click", function () {
                var $this = $(this),
                    command = $this.data("command");

                if ($this.hasClass("link")) {
                    executeCommand(selector, command, prompt("What is the link:", "http://"));
                } else {
                    executeCommand(selector, command, "");
                }

                if ($this.hasClass("image")) {
                    $popup
                        .fadeToggle()
                        .find(".upload")
                            .off("click")
                            .on("click", function () {
                                $popup.fadeOut();
                                $this.toggleClass("selected");
                            });
                    $this.toggleClass("selected");
                }
            });

        $selector
            .find("select")
            .on("change", function () {
                var $this = $(this),
                    command = $this.data("command"),
                    value = $this.val();
                executeCommand(selector, command, value);
            });
    };

    var executeCommand = function (selector, command, value) {

        var textEditor = document.querySelector(selector)
                                 .querySelector("iframe")
                                 .contentWindow;
        textEditor.document.execCommand(command, false, value);
        textEditor.focus();
    };

    var initializeImageHandler = function (selector) {
        var target = document.querySelector(selector).querySelector(".imageContainer");

        target.addEventListener("dragover", function (e) {
            e.preventDefault();
        }, false);

        target.addEventListener("dragleave", function (e) {
            e.preventDefault();
        }, false);

        target.addEventListener("drop", function (e) {
            e.preventDefault();
            loadFile(e.dataTransfer.files[0], document.querySelector(selector).querySelector("iframe"));
        }, false);

        document.addEventListener("dragover", function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener("dragleave", function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener("drop", function (e) {
            e.preventDefault();
        }, false);

        document.querySelector(selector).querySelector(".upload").addEventListener("click", function () {
            var file = document.querySelector(selector).querySelector(".browsedFile").files[0];
            loadFile(file, document.querySelector(selector).querySelector("iframe"));
        }, false);

        var loadFile = function (f, destination) {

            var reader = new FileReader();

            reader.onload = function (event) {
                var newImage = document.createElement("img");
                newImage.src = event.target.result;
                destination.contentWindow.document.getElementsByTagName("body")[0].appendChild(newImage);
            };

            reader.readAsDataURL(f);
        }
    };

    var initializeCopyPasteHandler = function(selector) {

        $(selector)
            .find("iframe")
            .contents()
            .find("body")
            .on("paste", function(e) {
                var pastedData = e.originalEvent.clipboardData.getData('text');
                e.preventDefault();
                executeCommand(selector, "insertHTML", pastedData);
            });
    };

    var Button = (function () {

        var cssClasses = {
            bold: "bold",
            italic: "italic",
            createLink: "link",
            insertOrderedList: "ol",
            insertUnorderedList: "ul",
            undo: "undo",
            redo: "redo",
            justifyCenter: "center",
            justifyLeft: "left",
            justifyRight: "right",
            justifyFull: "full",
        };

        function Button(command) {
            this.command = command;

        };

        Button.prototype.getMarkup = function () {
            var markup = '<button type="button" data-command="' + this.command + '" class="button ' + cssClasses[this.command] + '"></button>';
            return markup;
        };

        return Button;
    })();

    var DropDown = (function () {

        var cssClasses = {
            fontName: "fonts",
            fontSize: "fontSize"
        };

        function DropDown(command, options) {
            this.command = command;
            this.options = options || [];
        };

        DropDown.prototype.getMarkup = function () {

            var markup = '<select data-command="' + this.command + '" class="' + cssClasses[this.command] + '">';

            markup += '<option value="' + this.options[0]["value"] + '"selected hidden>' + this.options[0]["text"] + '</option>';

            for (var i = 1; i < this.options.length; i++) {

                markup += '<option value="' + this.options[i]["value"] + '">' + this.options[i]["text"] + '</option>';
            }

            markup += '</select>';

            return markup;
        };

        return DropDown;
    })();

    return Jute;
})();