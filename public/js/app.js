$(function(){
  var config = {};
  var modal_open = false;
  $.getJSON( "/js/config.json", function( data ) {
    config = data;
    console.log(config);
  });
  $('.content').delegate('.folder','click',function(){
    loadData($(this).text());
  })
  $('.content').delegate('.file','click',function(){
    /*
    window.open("/file/"+$(this).text(),'_blank');
    window.open("");
    */
      modal_open = true;
     $('#myModal').modal('show');
     var type = $(this).text().split('.')[$(this).text().split('.').length-1].toLowerCase();
     var info = config.types[type];
     $('#currentFile').val($(this).attr('data-id'));
     if(info === "video"){
       $('#modal-content').html('<video controls="true" src="/file/'+$(this).text()+'"/>');
     }else if(info === "img"){
       $('#modal-content').html('<img src="/file/'+$(this).text()+'"/>');
     }
     $('#myModal .close').click(function(){
       $('#modal-content').html("");
       modal_open = false;
     });
  })
  $('.swipe').click(function(){
    var way = $(this).attr('data-do');
    var id = $('#currentFile').val();
    if(way === 'left'){
      id--;
      if(id<0){
        id = $('.file').length-1;
      }

    }else{
      id++;
      if(id > $('.file').length-1){
        id = 0;
      }
    }
    $('.file[data-id="'+id+'"]').click();
  })
  loadData("");
  function loadData(path){
    $.post('/path',{path:path},function(data,status){
      console.log(data);
      data = JSON.parse(data);
      console.log(data);
      $('.folders').html("");
      for(var i = 0;i<data.dirs.length;i++){
        $('.folders').append('<div class="col-xs-12 col-sm-6 col-md-4 btn btn-default folder">'+data.dirs[i]+'</div>');
      }
      $('.files').html("");
      for(var i = 0;i<data.files.length;i++){
        $('.files').append('<div class=" col-xs-12 col-sm-6 col-md-4 btn btn-default file" data-id="'+i+'">'+data.files[i]+'</div>');
      }
    });
  }

  /**
   * http://stackoverflow.com/a/23230280/3213036
   *
   */
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  var xDown = null;
  var yDown = null;

  function handleTouchStart(evt) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
  };

  function handleTouchMove(evt) {
      if ( ! xDown || ! yDown ) {
          return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
          if ( xDiff > 0 ) {
              /* left swipe */
              if(modal_open === true){
                  $('.swipe[data-do="right"]').click();
              }
          } else {
              /* right swipe */
              if(modal_open === true){
                $('.swipe[data-do="left"]').click();
              }
          }
      } else {
          if ( yDiff > 0 ) {
              /* up swipe */
          } else {
              /* down swipe */
          }
      }
      /* reset values */
      xDown = null;
      yDown = null;
  };
})
