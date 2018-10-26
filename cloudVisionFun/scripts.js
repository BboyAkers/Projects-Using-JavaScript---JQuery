document.addEventListener('DOMContentLoaded', () => {

  const video = document.querySelector('.video');
  const canvas = document.querySelector('.canvas');
  const cameraButton = document.querySelector('.camera-button');
  const snapPicture = document.querySelector('.snap');
  const submitPicture = document.querySelector('.submitPicture');
  const itemListContainer = document.querySelector('.itemListContainer');


  let context = canvas.getContext("2d");
  let base64;
  
  cameraButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
      video.src = window.URL.createObjectURL(stream);
    })
    .catch((err) => {
      // console.log('You are blocked homie');
    });
  });

  snapPicture.addEventListener('click', () => {
    context.drawImage(video, 0, 0, video.width, video.height);

    base64 = canvas.toDataURL();
    base64 = base64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    // console.log(base64);
    return base64;
  });

  submitPicture.addEventListener('click', () => {
    let url = 'https://vision.googleapis.com/v1/images:annotate?key={APIKEY}';
    let data = {
      "requests": [
        {
          "image": {
            "content": base64
          },
          "features": [
            {
              "type": "WEB_DETECTION"
            }
          ]
        }
      ]
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    })
    .then((myJson) => {
      // console.log(JSON.stringify(myJson));
      let items = myJson.responses[0].webDetection.webEntities;
      let itemList = '';
      items.forEach(item => {
        if (item.description != null){
          itemList += '<li class="descriptionListItem">' + item.description + '</li>';
        }
      });
      itemListContainer.innerHTML = itemList
    });
  });
});