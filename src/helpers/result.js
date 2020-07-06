var Result = {
    Success :  true,
    Error :  null,
    Exception :  null,
    Response :  null,
    Items : [],
    

    createResult : function(){
      return {
        Success :  true,
        Error :  null,
        Exception :  null,
        Response :  null,
        Items : []
      };
    }
}

module.exports = Result;
