$(document).ready(function() {
   if ($('#active_admin_content textarea').length > 0) {       
     var data = $('textarea');
     $.each(data, function(i) {
       CKEDITOR.replace(data[i].id);
     });     
   }  
});
