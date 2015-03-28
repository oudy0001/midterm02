/***************************************
in CodePen, this code runs after the HTML is loaded... 
the wrapper property could fail depending on where you have your script.
****************************************/
var app = {
  wrapper: document.querySelector('.wrapper'),
  mc: null,
  modal:null,
  addListeners: function(){
    app.mc = new Hammer(app.wrapper, {});
    var singleTap = new Hammer.Tap({ event: 'tap' });
    var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });
    app.mc.add([doubleTap, singleTap]);
    doubleTap.requireFailure(singleTap);
    
		app.mc.on("tap", function(ev){
      //single tap
    	ev.target.textContent = ev.type +" gesture detected.";
      app.modal = document.getElementById("single");
      app.modal.style.display = "block";
      setTimeout(function(){
        app.modal.style.display = "none";
      }, 2000);
    });
    app.mc.on("doubletap", function(ev){
      //double tap
    	ev.target.textContent = ev.type +" gesture detected.";
      app.modal = document.getElementById("double");
      app.modal.style.display = "block";
      setTimeout(function(){
        app.modal.style.display = "none";
      }, 2000);
    }); 
    
  }
}

app.addListeners();