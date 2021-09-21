import {useEffect} from 'react';

const useAsyncFetch = function (url, options, thenFun, catchFun) {
  console.log('got into useAsyncFetch function')
  async function fetchData() {
    console.log(url)
    // Send request to origin server at appropriate endpoint
    let response = await fetch(url);

    // Wait for origin server to send back JSON object
    let json = await response.json();

    thenFun(json);
  }

  // The effect hook is a function called when the component is created or updated.
  useEffect(function () {
    console.log("Calling fetch");
    fetchData();
  }, []);
}

export default useAsyncFetch;