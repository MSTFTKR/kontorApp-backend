const axios = require("axios");

const fonk = async () => {
  try {
    const result= await axios.post(
      "http://localhost:3000/data/create",
      {
        alinanKontor: "10000",
        kullanilanKontor: "55600",
        kalanKontor: "5000",
        userTcVkn: "1236758",
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: "D4SAd9aSa84asdfCX654sa54dASAD",
        },
      }
    );
    console.log(result.data)
  } catch (error) {
    
  }
 
};
fonk()