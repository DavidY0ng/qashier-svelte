// export async function load({ fetch }) {
//     const resp = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability');
  
//     const res = await resp.json();
//     if (resp.status == 200) {
//       return {
//         carparks: res.items
//       }
//     } else {
//       return {
//         carparks: []
//       }
//     }
//   }