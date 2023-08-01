<script>
  import { onMount } from "svelte";
  let carParkData = null;
  async function carData() {
  try {
    const res = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability', {
      method: 'GET',
      mode: 'cors',
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json(); 
    const carparkData = data.items[0].carpark_data;

    // Filter car parks with total lots less than or equal to 100
    const carParksWith100OrLessLots = carparkData.filter((item) => {
      const totalLotsArray = item.carpark_info.map((info) => parseInt(info.total_lots));
      const totalLotsSum = totalLotsArray.reduce((sum, value) => sum + value, 0);
      return totalLotsSum < 100;
    });

    // Filter car parks with available lots greater than 100 but less than 300
    const carParksWith100To300Lots = carparkData.filter((item) => {
      const availableLotsArray = item.carpark_info.map((info) => parseInt(info.lots_available));
      const availableLotsSum = availableLotsArray.reduce((sum, value) => sum + value, 0);
      return availableLotsSum >= 100 && availableLotsSum < 300;
    });

    // Filter car parks with total lots between 300 and 400 (inclusive)
    const carParksWith300To400Lots = carparkData.filter((item) => {
      const totalLotsArray = item.carpark_info.map((info) => parseInt(info.total_lots));
      const totalLotsSum = totalLotsArray.reduce((sum, value) => sum + value, 0);
      return totalLotsSum >= 300 && totalLotsSum < 400;
    });

    // Filter car parks with total lots of 400 or more
    const carParksWith400OrMoreLots = carparkData.filter((item) => {
      const totalLotsArray = item.carpark_info.map((info) => parseInt(info.total_lots));
      const totalLotsSum = totalLotsArray.reduce((sum, value) => sum + value, 0);
      return totalLotsSum >= 400;
    });

    // Find the highest and lowest available lots, highest total_lots, and corresponding carpark_number for each category
    const categories = [
      { name: 'SMALL', carParks: carParksWith100OrLessLots },
      { name: 'MEDIUM', carParks: carParksWith100To300Lots },
      { name: 'BIG', carParks: carParksWith300To400Lots },
      { name: 'LARGE', carParks: carParksWith400OrMoreLots },
    ];

    const results = {};

    for (const category of categories) {
      let highestAvailableLots = 0;
      let highestAvailableCarparkNumbers = [];
      let lowestAvailableLots = Infinity;
      let lowestAvailableCarparkNumbers = [];

      for (const carpark of category.carParks) {

        const availableLotsArray = carpark.carpark_info.map((info) => parseInt(info.lots_available));
        const highestAvailableInCarpark = Math.max(...availableLotsArray);
        const lowestAvailableInCarpark = Math.min(...availableLotsArray);

        if (highestAvailableInCarpark > highestAvailableLots) {
          highestAvailableLots = highestAvailableInCarpark;
          highestAvailableCarparkNumbers = [carpark.carpark_number];
        } else if (highestAvailableInCarpark === highestAvailableLots) {
          highestAvailableCarparkNumbers.push(carpark.carpark_number);
        }

        if (lowestAvailableInCarpark < lowestAvailableLots) {
          lowestAvailableLots = lowestAvailableInCarpark;
          lowestAvailableCarparkNumbers = [carpark.carpark_number];
        } else if (lowestAvailableInCarpark === lowestAvailableLots) {
          lowestAvailableCarparkNumbers.push(carpark.carpark_number);
        }
      }

      const categoryResult = {
        highestAvailableLots,
        highestAvailableCarparkNumbers,
        lowestAvailableLots,
        lowestAvailableCarparkNumbers,
      };

      results[category.name] = categoryResult;
    }

    console.log(results);
    return results; // Return the object with the desired values for each category
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  

  // Call the fetchData function using onMount

}
async function updateCarData() {
    carParkData = await fetchCarData();
  }

onMount(async () => {
    carParkData = await carData();
    const interval = setInterval(updateCarData, 1000);
  });

</script>

<h1>CARPARK DATA</h1>
<pre>{JSON.stringify(carParkData, null, 2)}</pre>
