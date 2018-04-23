module.exports = function(cryptoJS,uuid) {
    var models = {
        salt: function() 
        { 
            function _p8(s) {
             var p = (Math.random().toString(16) + "000000000").substr(2, 8);
             return s ? p.substr(0, 4) + p.substr(4, 4) : p;
         }
         return _p8() + _p8(true) + _p8(true) + _p8();
        },
        guid:function()
        {
          return uuid.v4();  
        },
        encrypt: function(str,salt) 
        {
            var key = cryptoJS.enc.Utf8.parse(salt);
            var iv = cryptoJS.enc.Utf8.parse("1234567899123456");

            var encrypted = cryptoJS.AES.encrypt(cryptoJS.enc.Utf8.parse(str), key, {
             keySize: 256,
             iv: iv,
             mode: cryptoJS.mode.CBC,
             padding: cryptoJS.pad.Pkcs7
            });

            return encrypted.toString();
        }
    };
    return models;
}