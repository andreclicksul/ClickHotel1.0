const handleJSON = res =>
    res.ok ? res.json() : Promise.reject(res.statusText);

export const postJSON = async(url, _body = null) => {

  let options;

  if (_body === null)
  {
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };      
  }
  else
  {
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },      
      body: Object.keys(_body)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(_body[k])}`)
        .join('&')
    };
  }
   
  return await fetch(url, options).then(handleJSON);
}