// $('a').click(function(){
//     href="javascript:void(0);"
//     ontouchstart="return true;"
// });
var lastHas = "";
var currentSucursal = "";
var menuActivo = false;
var screenActivo = true;
function loadMenu(hash, display) {
    /** Variables de configuracion **/
    var url = "http://198.1.89.58/~appel10/el10/p.php?categoria="; //produccion
    var SIN_IMAGEN = new Array('cafeteria', 'bebidas');
    var pagina = url + hash;
    //Actualizando titulo de la pagina segun la categoria consultada
    hash = hash.charAt(0).toUpperCase() + hash.slice(1); //poniendo primera letra en mayuscula
    $("#itemName").text(hash);
    var sin = SIN_IMAGEN.indexOf(hash) > -1;
    /** definicion funcion: agrupar platillos por categoria **/
    var anexarPlatillo = function(lista, platillo, fusionar) {
        var agregado = false;
        categoria = platillo.categoria;
        if (fusionar) {
            categoria += ' ' + platillo[fusionar];
        }
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].clave == categoria) {
                lista[i].platillo.push(platillo);
                agregado = true;
                break;
            }
        }
        if (!agregado) {
            lista.push({clave: categoria, mostrar: !platillo.personalizacion, criterio: platillo[fusionar], nombre: platillo.categoria, platillo: [platillo]});
        }
    }
    /** consulta y tratamiento de platillos **/
    $.ajax({
        url: pagina,
        async: false,
        timeout: 9000,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(data, status) {
            /** variables de estilo segun seccion consultada **/
            var newData = {
                vino: hash == 'Vinos',
                cortes: hash == "Cortes",
                cafeteria: hash == 'Cafeteria',
                bebida: hash == 'Bebidas' || hash == 'Cafeteria',
                categoria: []
            };
            newData.especial = newData.vino || newData.bebida || newData.cortes ;
            //tratamiento de cada platillo recibido segun su categoria
            for(var i = 0; i < data.length; i++){
                data[i].seccion = data[i].seccion.toLowerCase();
                data[i].personalizacion = data[i].personalizacion != "0";
                /** separacion de descripcion de vinos en 'vista', 'nariz' y 'boca' **/
                if (newData.vino && data[i].descripcion.toLowerCase().indexOf('vista') > -1) {
                    var fragmento = data[i].descripcion.split(/\n/);
                    for(var j = 0; j < fragmento.length; j++){
                        var par = fragmento[j].split(':');
                        if (par.length != 2) {break;}
                        data[i][par[0].toLowerCase()] = par[1].trim();
                    }
                }
                anexarPlatillo(newData.categoria, data[i], newData.vino? 'ml': false);
                /** tratamiento de valores por defecto **/
                data[i].imagen = data[i].imagen && data[i].imagen.length > 0? data[i].imagen: null;
                data[i].descripcion = data[i].descripcion && data[i].descripcion.length > 0? data[i].descripcion: null;
                data[i].contenido = data[i].descripcion || data[i].imagen;
                data[i].imagen = sin? null: data[i].imagen;
                if(data[i].imagen && data[i].imagen.indexOf('.') ==-1) {
                    data[i].imagen +='.jpg';
                }
            }
            /** impresion de datos recibidos **/
            var platilloTemplateDOM = $('#platilloTemplate');
            var platilloTemplate = platilloTemplateDOM.html();
            var contenido = newData;
            var render = Mustache.render(platilloTemplate, contenido);
            $('#items').off("click");
            loadEffects();
            $(".dinamicContainer").append(render);
            /** calculo de tamaños originales de elementos de cada platillo para despues ocultarlos **/
            $('.item').each(function(){
                var crece = $(this).find('.crece');
                var imagen = crece.find('.imagen');
                $(this).data('original-height', crece.length == 0? 0: crece.height());
                $(this).data('original-min-height', crece.length == 0? 0: parseInt(crece.css('min-height')));
                crece.css('min-height', '0px');
                crece.height(0);
            });
            //quitar icono de cargando, mostrado al incio por defecto
            $("#rightBar > div.menu").scrollTop( 0 );
        },
        error: function() {
            navigator.notification.alert('Se ha producido un error al cargar los datos', function(){location.href = 'index.html';}, 'Sin Internet');
        }
    });
    var screenSize = $('#rightBar').height() - 50;
    console.log(screenSize);
    function abrirElemento (elm, otherOpen) {
        var t = $("#" + elm);
        var heightAnimation = 0;
        var grow = t.find('.crece');
        if (hash == 'Vinos') {
            heightAnimation = screenSize - t.outerHeight();
            //t.find('img.vinos').css('height', t.find('.col1').height()-10)
            if (heightAnimation > 340) {
                heightAnimation = 340;
            };
            console.log(heightAnimation)
            t.find('.col1 img').css('height', heightAnimation - 41);
        } else {
            proportion  = $( "#rightBar" ).width()/$( "#rightBar" ).height();
            if($("#rightBar").width() == 600 && $("#rightBar").height() >= 900){
                heightAnimation = 270;
            } else if(proportion > 1.2 ){
                heightAnimation = $( "#rightBar" ).height()*.7 + "px";
                $('#items figure.platillo img').css('margin-top','-15%');
            }
            else if(proportion > 1 ){
                heightAnimation = 300;
                $('#items figure.platillo img').css('margin-top','-15%');
            }
            else if(proportion > 0.70 ){
                heightAnimation = 250;
            }
            else if(proportion < 0.70 ){
                heightAnimation = 220;
            }
        };
        var animacionRequerida = (($('.menuWrapper').height() - 50) < $('.dinamicContainer').height());
        //abrir elementos a alturas calculadas con animacion 
        $('.colfull').css('height', heightAnimation);
        t.addClass('open');
        t.find("#descripcion").stop().animate({'opacity': 1}, 600);
        grow.addClass('open');
        //analizamos la duracion de la animación
        var st = t.offset().top - 50;
        var currentSt = $("#rightBar .menuWrapper").scrollTop();
        heigthCrece = heightAnimation;
        animationTime = st;
        if (animationTime < 0) {
            animationTime = animationTime*-1;
        };
        $("#rightBar .menuWrapper").stop().animate({'scrollTop': 0});
        $('.dinamicContainer').css("height", $('.dinamicContainer').height() + heigthCrece);
        if (animacionRequerida) {
            $("#rightBar .menuWrapper").stop().animate({'scrollTop': currentSt + st}, animationTime, function() {
                grow.stop().animate({'height': heigthCrece}, 300, function(){
                    grow.css('visibility', 'visible');
                    $('.dinamicContainer').removeAttr("style");
                });
            }); 
        } else {
            grow.stop().animate({'height': heigthCrece}, 300, function(){
                grow.css('visibility', 'visible');
                $('.dinamicContainer').removeAttr("style");
            });
        };
    };
    function colapsarElemento (elm, elm2) {
        //si existe elm2, al terminar de colapsar, abrirá el segundo elemento
        var t = $("#" + elm);
        var grow = t.find('.crece');
        var st = t.offset().top -50;
        var currentSt = $("#rightBar .menuWrapper").scrollTop();
        var alto = $('.dinamicContainer').height();
        $('.dinamicContainer').css("height", alto);
        var position = t.position();
        var animacionRequerida = (($('.menuWrapper').height() - 50) < $('.dinamicContainer').height() - grow.outerHeight());
        alturascrollerEnDispositivo = $('#rightBar').height() - 50;
        scrollMaximoTotal = alto - grow.outerHeight();
        scrollMaximoItem = position["top"] - 50 + t.outerHeight() - grow.outerHeight();
        heightMaximo = alto - grow.height() - alturascrollerEnDispositivo;
        scrollMaximoTotal = (scrollMaximoTotal - alturascrollerEnDispositivo + t.outerHeight() - grow.outerHeight());
        t.find('.crece').removeClass('open');
        t.find("#descripcion").css("opacity", 0);
        t.removeClass('open');
        t.removeAttr("style");
        grow.css('visibility', 'hidden');
        grow.stop().animate({'height': 0}, 300, function() {
            //SI DESPUES ABRIMOS UN ELEMENTO 
            if (elm2 != null) {
                abrirElemento(elm2, true);
            //SI SOLO SE COLAPSA ESTE ELEMENTO
            } else {
                if(scrollMaximoTotal < scrollMaximoItem && animacionRequerida == true){
                    $('#rightBar .menuWrapper').stop().animate({'scrollTop': heightMaximo}, 300,function  () {
                        $('.dinamicContainer').removeAttr("style");
                    });
                } else {
                    $('.dinamicContainer').removeAttr("style");
                };
            };
        });
    }
    /** Efectos de apertura de platillos para categorias CON imagen **/
    function loadEffects () {
        if (!sin) {
            $('#items').on('click', 'figure', function(){
                var id = $(this).attr("id");
                var t = $("#" + id);
                //no hacer nada si no hay contenido
                var hasContent = t.find('#descripcion').text().length > 0;
                hasContent = hasContent || t.find('img, div.imagen').length > 0;
                if (!hasContent) {return;}
                //colapsar todos los abietos
                var grow = t.find('.crece');
                $('.crece').css('min-height', '0px');
                var has = t.find('.crece').hasClass('open');
                if (has) {
                    colapsarElemento(id);
                } else {
                    if ($('.crece.open').length > 0) {
                        idAbierto = (hash == "Vinos")?$('.crece.open').parent().parent().attr("id"):$('.crece.open').parent().attr("id");
                        colapsarElemento(idAbierto, id);
                    } else {
                        abrirElemento(id);
                    }
                };
            });
        }
    }
}
$(window).load(function(){
    $('.fadeScreen').transition({ opacity:0 }, 500, function(){
        $('.fadeScreen').css('display', 'none')
    });
    $('.loading img').css('margin-top', ($('#rightBar').height())/2 - 36);
    m1Width = $("#leftBar").width();
    m2Width = $("#rightBar").width();
    areaTotal = $('body').width();
    tapWidth = $('.taps').width();
    $(".tap").css("width" ,tapWidth);
    $(".sucursalesContent").css({"width":(areaTotal - m1Width)});
    $('.sucursalesContent').transition({ x: -(areaTotal- m1Width)}, 0);
    function checkConnection(msg){
        if(navigator.connection.type == Connection.NONE){
            navigator.notification.alert(msg, function(){},'Sin Internet');
            return false;
        } else{
            return true;
        };
    };
    function launchConnectionError (msg) {
        navigator.notification.alert(msg, function(){},'Sin Internet');
    }
    function swipePage (position, elementToFade, boolean) {
        if (position == 0) {
            $( "#screen").unbind( "click" );
            if (elementToFade) {
                selector = $(elementToFade);
                selector.removeClass('active');    
                selector.transition({ opacity: 0 },150, function(){
                    $('.container').transition({x: position, duration: 300}, function(){
                        $('#screen').transition({ opacity: 0 }, function(){
                            menuActivo = false;
                            $('#screen').css('display', 'none');
                        }); 
                    });
                });
            } else {
                $('.container').transition({x: position, duration: 300}, function(){
                    $('#screen').transition({ opacity: 0 }, function(){
                        $('#screen').css('display', 'none');
                    }); 
                });
            };
        } else {
            $('#screen').css('display', 'block');
            $('#screen').transition({ opacity: 1}, 150, function(){
                if (elementToFade) {
                    selector = $(elementToFade);
                    selector.css('opacity', 0);
                    $('.container').transition({x: position, duration: 300}, function(){
                        selector.transition({ opacity: 1 }, function(){
                            selector.addClass('active');
                            $( "#screen" ).bind( "click", function() {
                              collapsarCarta(elementToFade);
                            });
                        });
                    });
                };
            });
        };
    };
    function expandirMenu1(target, animated) {
        wdt = tapWidth * Number(target);
        if (animated) {
            $('.tapContainer').stop().animate({
                    marginLeft: -wdt
            }, 300);
        } else{
            $('.tapContainer').css("marginLeft", -wdt);
            swipePage(m1Width, '.tapContainer', true);
        };
    }
    function collapsarMenu1 (target) {
        $('input').blur();
        $('.linkMain').removeClass('selected');
        setTimeout(function() {
               swipePage(0, '.tapContainer', false);
        }, 10);
    }
    function expandirCarta (target) {
        swipePage(-m2Width, '#rightBar > div.menu', true);
    }
    function collapsarCarta (target) {
        if (target == '.tapContainer') {
            collapsarMenu1();
        } else {
            if ($('#rightBar > div.menu').hasClass('active')) {
                swipePage(0, target, false);
            };
        }
    }
    function expandirSucursales (animated, elemento){
        id = $(elemento).attr("id");
        selector = "#"+ id + "-info";
        nombreSucursal = $(elemento).data("name");
        $('.sucursales .item').removeClass("active");
        $(selector).find(".title").html(nombreSucursal);
        $( "#" + id ).addClass("active");
        //esta expandido?
        if($('.sucursalesContent').hasClass('expanded')){
            if(currentSucursal != nombreSucursal){
                $(".sucursalesContent .active").fadeOut(300, function(){
                    $(".sucursalesContent .active").removeAttr('style');
                    $(".sucursalesContent .active").removeClass('active');
                    
                    $(selector).fadeIn(300);
                    $(selector).addClass("active");
                });
            }
        } else {
            if (animated) {
                $('.sucursalesContent').transition({ x: m1Width },300, function(){
                    $(selector).fadeIn(300);
                    $(selector).addClass("active");
                });
            } else {
                $('.sucursalesContent').transition({ x: m1Width}, 0);
                $(selector).addClass("active");
            };
            $(".sucursalesContent").addClass("expanded");
        }
        currentSucursal = nombreSucursal;
    };
    function collapsarSucursales (animated) {
        $('.sucursales .item').removeClass("active");
        $('.sucursalesContent .active').fadeOut(300, function(){
            $('.sucursalesContent .active').removeAttr('style');
            $('.sucursalesContent .active').removeClass('active');
            $('.sucursalesContent').transition({ x: -(areaTotal- m1Width) }, function(){
                $(".sucursalesContent").removeClass("expanded");
            });
        });
    }
    function removerActivosM1(){
        $(".linkMain").each(function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            };
        });
    }
    function getCurrentX(){
        var style = window.getComputedStyle($('.container').get(0));  // Need the DOM object
        var matrix = new WebKitCSSMatrix(style.webkitTransform);
        return matrix.m41;
    }
    $('body').on('swipeleft', function(e){
        cP = getCurrentX();
        if(cP == m1Width && $('.sucursalesContent').hasClass('expanded')){
            collapsarSucursales(true);
        } else if (cP == m1Width ){
            collapsarMenu1();
        }
    });
    // $( "#screen" ).click(function(){
    //     elementToFade = ($('#rightBar > div.menu').hasClass('active'))?"#rightBar > div.menu" : '.tapContainer';
    //     collapsarCarta(elementToFade);
    // });
    $('body').on('swiperight', function(){
        cP = getCurrentX();
        if(cP == -m2Width && $('#rightBar > div.menu').hasClass('active')){
            swipePage(0, '#rightBar > div.menu', false);
        };
    })
    $(".linkMain").click(function(){
        if ($(this).data("target") == 1) {
            if(checkConnection('Para usar esta función necesita conexión a internet.')){
                if (getCurrentX() != 0) {
                    if ($(this).hasClass('selected')) {
                        collapsarMenu1();
                        $(this).removeClass('selected');
                    } else{
                        menuLevelObject = $(this).data('target');
                        expandirMenu1(menuLevelObject, true);
                        removerActivosM1();
                        $(this).addClass('selected');
                    };
                } else {
                    menuLevelObject = $(this).data('target');
                    expandirMenu1(menuLevelObject);
                    $(this).addClass('selected');
                };
            }
        } else {
            if (getCurrentX() != 0) {
                if ($(this).hasClass('selected')) {
                    collapsarMenu1();
                    $(this).removeClass('selected');
                } else{
                    menuLevelObject = $(this).data('target');
                    expandirMenu1(menuLevelObject, true);
                    removerActivosM1();
                    $(this).addClass('selected');
                };
            } else {
                menuLevelObject = $(this).data('target');
                expandirMenu1(menuLevelObject);
                $(this).addClass('selected');
            };
        };
    });
    $(".sucursales .item").click(function () {
        expandirSucursales(true, $(this));
    });
    $(".ficha i").click(function() {
        collapsarSucursales(true);
    });
    $(".wrapperGaleria .item").click(function(){
        if(checkConnection("Para consultar el menú necesita conexión a internet.") && menuActivo == false){
            menuActivo = true;
            category = $(this).data("category");
            if (category != lastHas) {
                textTitle = $(this).find("h2").text();
                $(".dinamicContainer").empty();
                $(".titleCategory").fadeOut(250, function() {
                   $(".titleCategory").html(textTitle);
                   $(".titleCategory").fadeIn(250);
                })
                lastHas = category;
                loadMenu(category, 1);
            };
            expandirCarta(true);
        } 
    });
    /*$(".pedido").each(function() {
        tel = String($(this).attr('href'));
        telNum = tel.split(':');
        textF = "Teléfono: " + telNum[1];
        if( $(this).data('sucursal-web')){
            $(this).parent().parent().prepend("<li><a class='txt'>" + textF + "</a></li>")
            $(this).html("Haz tu pedido en linea");
            $(this).removeAttr("href");
            $(this).attr('href',"https://entrega.com.mx/dom/r/diezcon.html?m=sucursal;su_id=" + $(this).data("sucursal-web"));
            $(this).addClass('browserExternal');
        } else{
            $(this).html(textF);
        }
    });*/
    // activacion de clase browserExternal para abrir links en navegador nativo predeterminado
    $('a.browserExternal').on('click', function(e){
        e.preventDefault();
        if(checkConnection("Para abrir este link necesita conexión a internet.") == true){
            var href = $(this).attr('href');
            window.open(href, '_system', 'location=yes');
        };
    })
    $("#cumple").on('focus', function() {
        $('#miCumple').fadeOut();
        
    })
    $('#cumple').on('blur', function() {
        if($(this).val()== ""){
            $('#miCumple').fadeIn();
        };
    });
    $('#comentarios').on('focus', function(){
        if($(this).val() == "Mensaje"){
            $(this).val("");
        }
    });
    $('#comentarios').on('blur', function(){
        if($(this).val() == ""){
            valor = "Mensaje";
            $(this).val(valor); 
        }
    });
    function IsEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
    $("#quejaycomen").submit(function(e){
        e.preventDefault(); 
        var valido = true;
        if ($('#nombre').val().length <= 3) {
            valido = false;
            elem = $('#nombre'); 
            label = elem.parent().parent().find('label');
            if(elem.val().length == 0){
                text = 'Por favor introduzca su nombre.';
            } else {
                text = 'Su nombre necesita al menos 3 caracteres.';
            }
            label.text(text);
            label.addClass('error');
            elem.addClass("error");
            watchInput(elem, label, 'Su nombre necesita al menos 3 caracteres.' );
        };
        if ($('#comentarios').val().length <= 3 || $('#comentarios').val() == "Mensaje") {
            valido = false;
            elem = $('#comentarios'); 
            label = elem.parent().find('label');
            if(elem.val().length == 0){
                text = 'Introduzca sus comentarios.';
            } else {
                text = 'El comentario requiere de más de tres caracteres.';
            }
            label.text(text);
            label.addClass('error');
            elem.addClass("error");
            watchText(elem, label, 'El comentario requiere de más de tres caracteres.' );
        };
        if (!IsEmail($("#email").val())){
            valido = false;
            elem = $("#email");
            elem.addClass("error");
            label = elem.parent().parent().find('label');
            text = 'Introduzca un e-mail valido.';
            watchMail(elem, label, text);
        };
        if ($('#sucursal').val() == null) {
            valido = false;
            elem = $('#sucursal');
            label = elem.parent().parent().parent().find('label');
            label.removeClass('right');
            label.addClass('error');
            text = 'Escoja una sucursal.';
            elem.addClass("error");
            watchSucursal(elem, label, text);
        }
        function watchSucursal (elem, label, text) {
            elem.data('oldVal', elem.val());
            label.text(text);
            elem.bind("propertychange change click keyup input paste", function(event){
                if (elem.data('oldVal') != elem.val()) {
                    if(elem.val() != null){
                        label.removeClass("error");
                        label.addClass("right");
                        if (elem.hasClass("error")) {
                            elem.removeClass("error");
                        };
                        elem.addClass('valid');
                    } else {
                        if (elem.hasClass("valid")) {
                            elem.removeClass("valid");
                        };
                        label.addClass('error');
                        elem.addClass("error");
                    };
                }
            });
        }
        function watchMail (elem, label, text) {
            elem.data('oldVal', elem.val());
            label.text(text);
            elem.bind("propertychange change click keyup input paste", function(event){
                if (elem.data('oldVal') != elem.val()) {
                    if ( IsEmail(elem.val()) ){
                        elem.removeClass("error");
                        label.removeClass("error");
                        elem.addClass("valid");
                    } else{
                        elem.removeClass("valid");
                        elem.addClass("error");
                        label.addClass("error");
                    }               
                }
            });
        }
        function watchInput (elem, label, text) {
            elem.data('oldVal', elem.val());
            label.text(text);
            elem.bind("propertychange change click keyup input paste", function(event){
                if (elem.data('oldVal') != elem.val()) {
                    if(elem.val().length > 3 ){
                        label.removeClass("error");
                        if (elem.hasClass("error")) {
                            elem.removeClass("error");
                        };
                        elem.addClass('valid');
                    } else if (elem.val().length <= 3) {
                        if (elem.hasClass("valid")) {
                            elem.removeClass("valid");
                        };
                        label.addClass('error');
                        elem.addClass("error");
                    };
                }
            });
        }
        function watchText (elem, label, text) {
            elem.data('oldVal', elem.val());
            label.text(text);
            elem.bind("propertychange change click keyup input paste", function(event){
                if (elem.data('oldVal') != elem.val()) {
                    if(elem.val().length > 3 ){
                        label.removeClass("error");
                        if (elem.hasClass("error")) {
                            elem.removeClass("error");
                        };
                        elem.addClass('valid');
                    } else if (elem.val().length <= 3) {
                        if (elem.hasClass("valid")) {
                            elem.removeClass("valid");
                        };
                        label.addClass('error');
                        elem.addClass("error");
                    };
                }
            });
        }
        var datos = $('#quejaycomen').serializeArray();
        if (valido == true ) {    
            $.getJSON('http://godisruptive.com/eldiez/save.php',datos,function(res){
                if (res.guardado == true) {
                    $(".contacto .content").fadeOut(300, function () {
                        $(".contacto .content").empty();
                        $(".contacto .content").html("<p class='text'>Gracias por tus comentarios, nos comunicaremos contigo a la brevedad.</p>");
                        $(".contacto .content").fadeIn(300);
                    });
                };
            }, function () {
                console.log("error");
            });
        }; 
    });
})