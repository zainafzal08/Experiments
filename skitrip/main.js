const vm = new Vue({
    el: '#app',
    data: {
      items: [
        {
          type: 'travel',
          title: 'Bus To Jindabyne',
          icon: 'bus',
          from: {
            time: '7:00 am',
            date: '2nd of July 2019',
            location: 'Western Forecourt, Bays 5 & 6, Sydney Central',
          },
          to: {
            time: '1:45 pm',
            date: '2nd of July 2019',
            location: 'Bus Bays, National Parks and Wildlife Visitor Centre'
          }
        },
        {
          type: 'travel',
          title: 'Walk To Hotel',
          icon: 'walk',
          from: {
            time: '1:45 pm',
            date: '2nd of July 2019',
            location: 'Bus Bays, National Parks and Wildlife Visitor Centre',
          },
          to: {
            time: '2:00 pm',
            date: '2nd of July 2019',
            location: '10 Kosciusko Road, Jindabyne NSW 2627'
          }
        },
        {
            type: 'event',
            title: 'Chill',
            icon: 'sleep',
            description: 'Kill some time, watch a studio gibli film'
          }
      ]
    }
  })