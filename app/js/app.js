(function () {
    

    $(document).ready(function () {
        var urlProtocal = location.protocol + '//' + location.host + location.pathname;

        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {

                var pair = vars[i].split("=");

                if (pair[0] == variable) {
                    return pair[1];
                }
            }
        }

        function checkSetValue(field, queryName) {
            if ($(field).val() === "") {
                $(field).val(getQueryVariable(queryName));
            }
        }

        function setValue(field, queryName) {
            if (!getQueryVariable(queryName)) {
                $(field).val();
            } else {
                $(field).val(getQueryVariable(queryName));
            }
        }

        checkSetValue("[name=UTM_Medium]", "utm_medium");
        checkSetValue("[name=UTM_Source]", "utm_source");
        checkSetValue("[name=UTM_Campaign]", "utm_campaign");
        checkSetValue("[name=UTM_AdName]", "utm_adname");
        checkSetValue("[name=UTM_AdGroup]", "utm_adgroup");
        checkSetValue("[name=UTM_KW]", "utm_term");
        checkSetValue("[name=UTM_Term]", "utm_term");
        checkSetValue("[name=UTM_Domain]", "utm_domain");
        checkSetValue("[name=UTM_LP]", "utm_lp");
        checkSetValue("[name=UTM_Asset]", "utm_asset");
        checkSetValue("[name=UTM_Content]", "utm_content");
        checkSetValue("[name=UTM_AdType]", "utm_adtype");
        setValue("[name=lcid1]", "lcid");
        checkSetValue("[name=crc1]", "crc");
        checkSetValue("[name=productFamily1]", "lrpf");
        checkSetValue("[name=cra1]", "cra");
        $("[name=landingPageUrl1]").val(urlProtocal);
        $("[name=redirect1]").val(location.protocol + '//' + location.host + '/subscribe');
        $('meta[property="og:url"]').attr("content", urlProtocal);
        $("[name=consentLanguage]").val($(".checkbox-label").html());


         //Check country and show zip code for US
        var country = $("#country");
        country.val("");
        country.change(checkCountry);

        function checkCountry(country) {
            if ($(this).val() === "US") {
                $("#zip-toggle").removeClass("d-none");
                $("#zip").attr("required", true);
                $("[name=subscribe]").prop("checked", true);
                $("[name=redirect1]").val(location.protocol + '//' + location.host + '/ThankYou');
            } else {
                $("#zip-toggle").addClass("hidden");
                $("#zip").attr("required", false);
                $("[name=subscribe]").prop("checked", false);
                $("[name=redirect1]").val(location.protocol + '//' + location.host +
                    '/subscribe?activity=rfx');
            }
        }

        var subscribe = $("input[name='subscribe']");
        subscribe.change(setRedirect);

        function setRedirect(subscribe) {
            if ($(this).is(":checked")) {
                $("[name=redirect1]").val(location.protocol + '//' + location.host + '/ThankYou');
            } else {
                $("[name=redirect1]").val(location.protocol + '//' + location.host +
                    '/subscribe?activity=rfx');
            }

        }

    });

 

}());

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
        }, false);
    });
    }, false);
})();

