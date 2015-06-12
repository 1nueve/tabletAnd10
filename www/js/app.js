	function loadMenu(hash, display){
		
		var url = "http://198.1.89.58/~appel10/el10/";
		var id = hash;
		var pagina = hash+".php";
		var display = display;

		if(display==1){
			console.log("vamos a pedir la url "+url+pagina);
			if(hash=="vinos"){var extraClass ="-vinos"}
			if(hash!="vinos"){var extraClass =""}
			$("#platillo").html(hash);
            //$("#verLista").attr("href","item-lista.html#lista_"+hash);
            //$("#verGaleria").attr("href","item-galeria.html#"+hash);
            //$(".toggleView").html('<a class="iconBtn" href="item-lista.html#lista_'+hash+'" data-transition="none"><i class="i-lista"></i></a><a class="iconBtn selected" href="item-galeria.html#'+hash+'" data-transition="none"><i class="i-galeria"></i></a>');
		}

		$.ajax({
				url: url+pagina,
				async:true,
				timeout:9000,
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				success: function(data, status){
					var conte = '';
					$.each(data, function(i,item){
                        $("#itemName").html(hash);
						if(item.maridaje!=null){var p_maridaje = '<p>'+item.maridaje+'</p>';}
						if(item.maridaje==null){var p_maridaje = "";}
						if(item.nombre!=null){var p_nombre = item.nombre;}
						if(item.nombre==null){var p_nombre = "";}
                        p_descripcion = item.descripcion? item.descripcion: '';
						if(p_nombre!=""){
							var pnombre = p_nombre.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
							if(display==1){
								conte += '<figure class="item"><figcaption><h2 id="nombre">'+pnombre+'</h2><p id="descripcion">'+p_descripcion+'</p><h3 id="precio">$'+item.precio+'</h3><nav class="social"><a href="#" class="facebook" onclick="window.plugins.socialsharing.shareViaFacebook(\'Menú El Diez: '+pnombre+' Ver mas en http://eldiez.com.mx\', null, null, function() {console.log(\'share ok\')}, function(errormsg){alert(errormsg)})"><i class="i-facebook"></i></a><a href="#" class="twitter" onclick="window.plugins.socialsharing.shareViaTwitter(\'Menú El Diez: '+pnombre+' Ver mas en http://eldiez.com.mx\')"><i class="i-twitter"></i></a></nav></figcaption><img src="http://198.1.89.58//~appel10/el10/menu/'+item.imagen+'.jpg"></figure>';
							}
						}
					});
                    
                    
		       // var localData = JSON.stringify(data);
		       // window.localStorage.setItem('newsArticle12', localData);

				if(display==1){
					conte +='';
				}
										
					if(display==1){
						$("#items.galeria").html(conte);
						htmlActual = conte;
					}
					if(display==0){
						$("#items.galeria").html("no se despliega nada");
					}
				},
				error: function(){
					var mensaje = 'Se ha producido un error al cargar los datos.';
					
					if(display==1){
						$("#items.galeria").html(mensaje);
						htmlActual = mensaje;
					}
				}
			});
			return 0;
	}


	function loadMenuLista(hash, display){
		
		var url = "http://198.1.89.58//~appel10/el10/";
		var id = hash;
		var pagina = hash+".php";
		var display = display;

		if(display==1){
			console.log("vamos a pedir la url "+url+pagina);
			$("#platillo").html(hash);
			if(hash=="vinos"){var extraClass ="-vinos"}
			if(hash!="vinos"){var extraClass =""}
            //$("#verLista").attr("href","item-lista.html#lista_"+hash);
            //$("#verGaleria").attr("href","item-galeria.html#"+hash);
            //$(".toggleView").html('<a class="iconBtn selected" href="item-lista.html#lista_'+hash+'" data-transition="none"><i class="i-lista"></i></a><a class="iconBtn" href="item-galeria.html#'+hash+'" data-transition="none"><i class="i-galeria"></i></a>');
		}

		$.ajax({
				url: url+pagina,
				async:true,
				timeout:9000,
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				success: function(data, status){
					var conte = '';
					var nElements = 0;
					$.each(data, function(i,item){
						nElements=nElements+1;
                        $("#itemName").html(item.nombre);
						if(item.maridaje!=null){var p_maridaje = '<p>'+item.maridaje+'</p>';}
						if(item.maridaje==null){var p_maridaje = "";}
						if(item.nombre!=null){var p_nombre = item.nombre;}
						if(item.nombre==null){var p_nombre = "";}
                        p_descripcion = item.descripcion? item.descripcion: '';
						if(p_nombre!=""){
							var pnombre = p_nombre.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
							if(display==1){
								conte += '<figure class="item"><figcaption><h2 id="nombre">'+pnombre+'</h2><p id="descripcion">'+p_descripcion+'</p><h3 id="precio">$'+item.precio+'</h3><nav class="social"><a href="#" class="facebook" onclick="window.plugins.socialsharing.shareViaFacebook(\'Menú El Diez: '+pnombre+' Ver mas en http://eldiez.com.mx\', null, null, function() {console.log(\'share ok\')}, function(errormsg){alert(errormsg)})"><i class="i-facebook"></i></a><a href="#" class="twitter" onclick="window.plugins.socialsharing.shareViaTwitter(\'Menú El Diez: '+pnombre+' Ver mas en http://eldiez.com.mx\')"><i class="i-twitter"></i></a></nav></figcaption><img src="http://198.1.89.58//~appel10/el10/menu/'+item.imagen+'.jpg"></figure>';
							}
						}
					});

				if(display==1){
					conte +='';
				}
										
					if(display==1){
						$("#items.lista").html(conte);
						htmlActual = conte;
					}
					if(display==0){
						$("#items.lista").html("no se despliega nada");
					}
				},
				error: function(){
					var mensaje = 'Se ha producido un error al cargar los datos.';
					
					if(display==1){
						$("#items.lista").html(mensaje);
						htmlActual = mensaje;
					}
				}
			});
			return 0;
	}


/* SUCURSALES */

	function loadSucursales(hash){
		
		var url = "http://198.1.89.58//~appel10/el10/";
		var pagina = "sucursal.php";
		console.log("vamos a pedir la url "+url+pagina);

			/*if (navigator.geolocation){
				navigator.geolocation.getCurrentPosition
				(
				 function(ubicacion){
					latitud = ubicacion.coords.latitude;
					longitud = ubicacion.coords.longitude;
					
				},
				 function (error) {});
			}
			else{
				alert("Tu dispositivo no soporta esta función");
				return;
			}*/

/* generar lista de sucursales */
		$.ajax({
				url: url+pagina,
				async:true,
				timeout:9000,
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				success: function(data, status){
					var conte = '';
					$.each(data, function(i,item){
                    $("#sucName").html(item.nombre);
					mapa = item.mapa.split(",");
					var lat = mapa[0];
					var longi = mapa[1];
					conte += '<li class="item"><a class="" href="#"><h2>'+item.nombre+'</h2><p>'+item.direccion+'</p><i class="i-arrow-right"></i></a><div class="content mp-level" data-level="2"><header class="bar"><h2 class="title" id="sucName"><!--Nombre de Sucursal--></h2><div class="leftBtns"><a class="iconBtn mp-back" href="#" data-direction="reverse"><i class="i-arrow-left"></i></a></div><div class="rightBtns"><a href="#"><i class="i-share"></i></a></div></header><div class="whiteBk"></div></div><a class="llevame hide" href="maps://maps.apple.com/?q='+lat+','+longi+'&z=10"><i class="i-map-alt"></i><label class="hide">+item.distancia+m</label><img src="" alt=""><label class="cta">¿cómo llegar?</label></a></li>';
					});	              
					
					$("#sucursales.lista").html(conte);
					htmlActual = conte;
				},
				error: function(){
					var mensaje = 'Se ha producido un error al cargar los datos.';
					$("#sucursales.lista").html(mensaje);
					htmlActual = mensaje;
				}
			});
			return 0;
	}

/* generar ficha de sucursal */
	function loadSucursal(hash){
		
		var url = "http://198.1.89.58//~appel10/el10/";
		var pagina = "suc"+hash+".php";
		console.log("vamos a pedir la url "+url+pagina);

		$.ajax({
				url: url+pagina,
				async:true,
				contentType: "application/json; charset=utf-8",
				timeout:9000,
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				success: function(data, status){
					var conte = '';
					$.each(data, function(i,item){
					$("#sucName").html(item.nombre);
					mapa = item.mapa.split(",");
					var lat = mapa[0];
					var longi = mapa[1];
					conte += '<figure><img src=""><figcaption><p>'+item.direccion+'</p></figcaption></figure><div class="info"><h2>Horarios de servicio:</h2><ul class="horario">'+item.horario+'</ul><ul class="actions"><li><a class="txt" href="tel:'+item.telefono+'">Hacer reservación o pedido</a></li><hr><li><a class="txt" href="maps://maps.apple.com/?q='+lat+','+longi+'&z=10">¿Cómo llegar?</a></li></ul></div>';
					});
					
                     
					$("#sucursales-info").html(conte);
					htmlActual = conte;
				},
				error: function(){
					var mensaje = 'Se ha producido un error al cargar los datos.';
					$("#sucursales-info").html(mensaje);
					htmlActual = mensaje;
				}
			});
			return 0;
	}

function init(e) {

	var hash = window.location.hash;
	hash = hash.replace("#","");
    if(hash==""){
	    loadMenu("vinos", 0);
	    loadMenu("pizzas", 0);
	    loadMenu("empanadas", 0);
	    loadMenu("sopas", 0);
	    loadMenu("hamburguesas", 0);
	    loadMenu("diezada", 0);
	    loadMenu("platillos", 0);
	    loadMenu("quesos", 0);
	    loadMenu("chorizo", 0);
	    loadMenu("pizzas", 0);
	    loadMenu("baguettes", 0);
	    loadMenu("pastas", 0);
	    loadMenu("ensaladas", 0);
	    loadMenu("guarniciones", 0);
	    loadMenu("cortes", 0);
	    loadMenu("parrilla", 0);
	    loadMenu("postres", 0);
	    loadMenu("cafeteria", 0);
	    loadMenu("bebidas", 0);
	    loadSucursales('sucursal');
	}

    if(hash=="vinos"||hash=="pizzas"||hash=="arracheras"||hash=="empanadas"||hash=="sopas"||hash=="hamburguesas"||hash=="diezada"||hash=="platillos"||hash=="quesos"||hash=="chorizo"||hash=="baguettes"||hash=="pastas"||hash=="ensaladas"||hash=="guarniciones"||hash=="cortes"||hash=="parrilla"||hash=="postres"||hash=="cafeteria"){
    	loadMenu(hash, 1);
    }

    if(hash=="lista_vinos"||hash=="lista_pizzas"||hash=="lista_arracheras"||hash=="lista_empanadas"||hash=="lista_sopas"||hash=="lista_hamburguesas"||hash=="lista_diezada"||hash=="lista_platillos"||hash=="lista_quesos"||hash=="lista_chorizo"||hash=="lista_baguettes"||hash=="lista_pastas"||hash=="lista_ensaladas"||hash=="lista_guarniciones"||hash=="lista_cortes"||hash=="lista_parrilla"||hash=="lista_postres"||hash=="lista_cafeteria"||hash=="lista_bebidas"){
    	hash = hash.replace("lista_","");
    	loadMenuLista(hash, 1);
    }

    if(hash=="sucursales"){
    	loadSucursales('sucursal');
    }

    if(hash==1||hash==2||hash==3||hash==4||hash==5||hash==6||hash==7||hash==8||hash==9||hash==10||hash==11){
    	loadSucursal(hash);
    }


    
/* TOGGLE VIEWS */    
 $('#verLista').click(function() {
    $(this).addClass('selected');
    $('#verGaleria').removeClass('selected');
    $('#verMapa').removeClass('selected');
    $('#carta').removeClass('galeria');
    $('#carta').addClass('lista');
    $('#items').removeClass('galeria');
    $('#items').addClass('lista'); 
    $('#sucursales').removeClass('map');
    $('#sucursales').addClass('lista'); 
    $('#mapa').removeClass('show'); 
    $('#mapa').addClass('preview'); 
     
 });
                      
$('#verGaleria').click(function() {
    $(this).addClass('selected');
    $('#verLista').removeClass('selected');
    $('#carta').removeClass('lista');
    $('#carta').addClass('galeria'); 
    $('#items').removeClass('lista');
    $('#items').addClass('galeria');  
 }); 
    
$('#verMapa').click(function() {
    $(this).addClass('selected');
    $('#verLista').removeClass('selected');
    $('#sucursales').removeClass('lista');
    $('#sucursales').addClass('map'); 
    $('#mapa').removeClass('preview'); 
    $('#mapa').addClass('show'); 
 }); 
    

//SWIPE OPTIONS.
var swipeOptions={swipe:swipe,threshold:100}
    $(function(){$("#cover").swipe(swipeOptions);});
    //SWIPE HANDLERS.
    function swipe(event,direction){
    if (direction=="down"){
        $(this).addClass('hide');
        $('#verLista').removeClass('selected');
        $('#verMapa').addClass('selected');
        $("#mapa").removeClass('preview');
        $("#mapa").addClass('show');}
     };
               
    
    
/* PLATILLOS */    
/* Galeria :: paginador de fichas */
  $("#next").click(function() {
  });

  $("#prev").click(function() {
  });
 
/* Lista :: open & close */
  $(document).on('click', '.item', function() {
  	$('.item').removeClass('open');
      $(this).addClass('open');
  	//$(this).find('.lista-open').css('display', 'block');
  });
$(document).on('click', '.item.open', function() {
  	$('.item.open').removeClass('open');
  	//$(this).find('.lista-open').css('display', 'block');
  });

    
/* CONTACTO */  
               $( "#comentarios" ).click(function() {
                  $( "#miMensaje" ).toggle( "fast", function() {});
                                  });
               $( "#cumple" ).click(function() {
                     $( "#miCumple" ).toggle( "fast", function() {
                     });
                     });
               
               
    $("#quejaycomen").submit( function(e){
		console.log("Form enviado");
		e.preventDefault();
		if($("#nombre").val().length == ""){
			$('#nombre').css('border', '1px #e75955 solid');
			return false;
		}
		else{
			$('#nombre').css('border', '1px #fff solid');
		}
		if($("#email").val().length == ""){
			$('#email').css('border', '1px #e75955 solid');
			return false;
		}
		else{
			$('#email').css('border', '1px #fff solid');
		}
		if($("#sucursal").val().length == ""){
			$('#sucursal').css('border', '1px #e75955 solid');
			return false;
		}
		else{
			$('#sucursal').css('border', '1px #fff solid');
		}
		if($("#comentarios").val().length == ""){
			$('#comentarios').css('border', '1px #e75955 solid');
			return false;
		}
		else{
			$('#comentarios').css('border', '1px #fff solid');
		}
		
		var messageDelay = 3000;
		var envmensajeria = $(this);
		var url = "http://198.1.89.58//~appel10/el10/";

		// Enviamos el formulario usando AJAX
		$.ajax({
			type: 'POST',
			url: url+'save_nuevo.php',
			timeoot: 8000,
			data: $(this).serialize(),
			// Mostramos un mensaje con la respuesta de PHP
			success: function(data) {
				$('#content_sendingMessage').html(data);
			},
			error: function(){
				var mensaje = "<p>Mensaje enviado!</p>"
				mensaje += "<script type='text/javascript'>";
				mensaje += "function redirect(){";
				mensaje += "self.location = 'index.html'}";
				mensaje += "setTimeout('redirect()',3000);</script>"
				$('#content_sendingMessage').html(mensaje);
				
			}
		});       
		return false;
	});


}
window.addEventListener('push', init);
$(document).ready(function() {
    init();
});