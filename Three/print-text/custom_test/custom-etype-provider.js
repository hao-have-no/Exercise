var customElementTypeProvider = (function () {
    return function (options) {

        var addElementTypes = function (context) {
            context.addPrintElementTypes(
                "testModule",
                [
                    new hiprint.PrintElementTypeGroup("常规", [
                        {
                            tid: 'testModule.tableCustom',
                            title: '表格',
                            type: 'tableCustom'
                        }
                    ]),
                ]
            );
        };

        return {
            addElementTypes: addElementTypes
        };

    };
})();
