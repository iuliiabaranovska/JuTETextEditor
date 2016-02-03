var JuTE = (function () {

    var controlsMarkup = '<div class="jute">' +
                             '<div class="controls">' +
                                  '<span class="simplyButtons">' +
                                      '<button type="button" data-command="bold" class="button bold"></button>' +
                                      '<button type="button" data-command="italic" class="button italic"></button>' +
                                      '<button type="button" data-command="createLink" class="button link"></button>' +
                                      '<button type="button" data-command="insertOrderedList" class="button ol"></button>' +
                                      '<button type="button" data-command="insertUnorderedList" class="button ul"></button>' +
                                      '<button type="button" data-command="undo" class="button undo"></button>' +
                                      '<button type="button" data-command="redo" class="button redo"></button>' +
                                      '<button type="button" class="button image"></button>' +
                                      '<button type="button" data-command="justifyCenter" class="button center"></button>' +
                                      '<button type="button" data-command="justifyLeft" class="button left"></button>' +
                                      '<button type="button" data-command="justifyRight" class="button right"></button>' +
                                      '<button type="button" data-command="justifyRight" class="button full"></button>' +
                                  '</span>' +

                                  '<div class="messagepop pop">' +
                                      '<input type="file" class="browsedFile">' +
                                          '<button class="upload">Upload</button>' +
                                      '</input>' +

                                  '</div>' +

                                  '<span class="dropdowns">' +
                                     '<select data-command="fontName" class="fonts">' +
                                         '<option value="Fonts" selected hidden>Fonts</option>' +
                                         '<option value="Normal">Normal</option>' +
                                         '<option value="Arial">Arial</option>' +
                                         '<option value="Comic Sans MS">Comic Sans MS</option>' +
                                         '<option value="Courier New">Courier New</option>' +
                                         '<option value="Monotype Corsiva">Monotype</option>' +
                                         '<option value="Tahoma New">Tahoma</option>' +
                                         '<option value="Times">Times</option>' +
                                         '<option value="Trebuchet New">Trebuchet</option>' +
                                    '</select>' +

                                    '<select data-command="fontSize" class="fontSize">' +
                                        '<option value="FontSize" selected hidden>Fonts Size</option>' +
                                        '<option value="1">XX-Small</option>' +
                                        '<option value="2">X-Small</option>' +
                                        '<option value="3">Small</option>' +
                                        '<option value="4">Medium</option>' +
                                        '<option value="5">Large</option>' +
                                        '<option value="6">X-Large</option>' +
                                        '<option value="7">XX-Large</option>' +
                                    '</select>' +
                                 '</span>' +
                             '</div>' +

                             '<div class="textEditor">' +
                                 '<iframe src="about:blank"></iframe>' +
                                 '<div class="imageContainer";>' +
                                 '<span class=".imageRull"><b>Drag image here!<b></span>' +
                                 '</div>' +
                             '</div>' +
                         '</div>';

    function Jute(selector) {
        $(selector).append(controlsMarkup);

        $(selector).find("iframe").contents().prop("designMode", "on");

        initializeHandlers(selector);

        uploadImage(selector);
    };

    var initializeHandlers = function (selector) {

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
                        .toggle("slow")
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

    var uploadImage = function (selector) {
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

    return Jute;
})();