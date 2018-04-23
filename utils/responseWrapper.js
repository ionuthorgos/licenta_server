module.exports = function() {
    var models = {
        sendResponse: function(ok, obj, message, text) {
            var response = {
                success: ok,
                data: obj,
                message: message,
                text:text
            };
            //console.log("send response " + JSON.stringify(response));
           return response;
        },
        success: function(obj) {
          var response = {
            success: true,
            data: obj,
            message: null,
            text:null
          };
          return response;
      },
      success: function(obj, text) {
        var response = {
          success: true,
          data: obj,
          message: null,
          text:text
        };
        // console.log(response);
        return response;
      },
      failure: function(obj) {
        var response = {
          success: false,
          data: null,
          message: obj.message,
          text:obj.text
        };
        return response;
      },

      sendInvalidToken: function(ok, obj, message, text) {
            var response = {
                success: ok,
                message: message,
                text:text,
                data: obj
            };
            return response;
        }
    };
    return models;
}
