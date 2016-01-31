var JuTE = (function () {

    var controlsMarkup = '<div class="jute">' +
                             '<div class="controls">' +
                                 '<button type="button" data-command="bold" class="button toggle bold">B</button>' +
                                 '<button type="button" data-command="italic" class="button toggle italic">I</button>' +
                                 '<button type="button" data-command="createLink" class="button link">Link</button>' +
                                 '<button type="button" data-command="insertOrderedList" class="button ol">OList</button>' +
                                 '<button type="button" data-command="insertUnorderedList" class="button ul">UList</button>' +
                                 '<button type="button" data-command="undo" class="button undo">Undo</button>' +
                                 '<button type="button" data-command="redo" class="button redo">Redo</button>' +

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
                                     '<option value="FontSize" selected hidden>FontSize</option>' +
                                     '<option value="1">XX-Small</option>' +
                                     '<option value="2">X-Small</option>' +
                                     '<option value="3">Small</option>' +
                                     '<option value="4">Medium</option>' +
                                     '<option value="5">Large</option>' +
                                     '<option value="6">X-Large</option>' +
                                     '<option value="7">XX-Large</option>' +
                                 '</select>' +
                             '</div>' +

                             '<div class="textEditor">' +
                                 '<iframe></iframe>' +
                             '</div>' +
                         '</div>';

    function Jute(selector) {
        $(selector).append(controlsMarkup);

        $(selector).find("iframe").contents().prop('designMode', 'on');

        initializeHandlers(selector);
    };

    var initializeHandlers = function (selector) {

        $(selector)
            .find(".button")
            .on("click", function () {
                var $this = $(this),
                    command = $this.data("command");

                if ($this.hasClass("toggle")) {
                    $this.toggleClass("selected");
                }

                if ($this.hasClass("link")) {
                    executeCommand(selector, command, prompt("What is the link:", "http://"));
                } else {
                    executeCommand(selector, command, "");
                }
            });

        $(selector)
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
    }

    return Jute;
})();