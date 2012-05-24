/*
 * jQuery PlaceHolder 1.0.4
 * http://www.kegles.com.br/placeholder/
 *
 * Copyright 2011, Nataniel Kegles
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Octuber 2011
 *
 * ****************
 * ** HOW TO USE **
 * ****************
 * - Add holder="text" to inputs
 * - Use input.holder CSS class to style holdered fields
 *
 * - WARNING: ALL HOLD INPUTS MUST HAVE "ID" TAG
 *
 * ****************
 * ** CHANGELOG! **
 * ****************
 * Version: 1.0.4 - Date: 2011-11-03
 *  - Fixed critical bug (.holder css class)
 * Version: 1.0.3 - Date: 2011-11-03
 *  - Fixed field listing parameters
 *  - Fixed focus issue in hidden fake fields
 *  - Fixed issue when data changed dynamically
 *  - Fixed issue before form submit (cleaning fields)
 * Version: 1.0.2 - Date: 2011-10-31
 *  - Improved search for holding fields with "holder!=''"
 *  - Solved compatibility issues with jQuery.meiomask
 *  - Added password fields compatibility
 */

//search by holder fields
$(document).ready(function() {
    $("input[type=text][holder!='']").each(function(){
        var field = $(this);
        var ffield = $(field).attr("id")+"__jquery_placeholder_passwordFakeField";
        //add holding class
        $(field).addClass("holder");
        //replace password fields with a fake field
        if ($(field).attr("type") == "password") {
            var newfield  = $("<input type='text' class='"+$(field).attr("class")+"' id='"+ffield+"' tabindex='"+$(field).attr("tabindex")+"' holder='"+$(field).attr("holder")+"' />").focus(function() {
                $(this).hide();
                $(field).show();
                $(field).focus();
            }).keypress(function(event) {
                event.preventDefault();
            });
            $(newfield).insertBefore(field);
            $(field).hide();
        }
        //bind focus event
        $(field).bind("focus",function() {
            $("#"+ffield).hide();
            $(field).show();
            if ($(field).hasClass("holder")) {
                $(field).val("");
                $(field).removeClass("holder");
            }
        });
        //bind blur event, if is a password field and value='' show the fakefield
        $(field).bind("blur",function() {
            if ($(field).val() == "") {
                if ($(field).attr("type") == "password") {
                    $(field).hide();
                    $("#"+ffield).show();
                }
                else {
                    $(field).val($(field).attr("holder"));
                    $(field).addClass("holder");
                }
            }
        });
        //bind change event, if value changed return to non holding state
        $(field).bind("change",function() {
            $(field).removeClass("holder");
        });
        //bind parent form submit, clean holding fields
        $(field).parents("form").submit(function() {
            $(this).find(".holder'").each(function() {
                if ($(this).val() == $(this).attr("holder")) {
                    $(this).val("");
                }
            });
        });			
    });
    setTimeout("__jquery_placeholder_goTitling()",100);
});
//change the holding values
function __jquery_placeholder_goTitling() {
    $("input[type=text][holder!=''][value='']").each(function(){
        if($(this).attr("holder") !== '' && $(this).attr("holder") !== undefined){
            $(this).val($(this).attr("holder"));
            $(this).addClass("holder");
        }
    });
}