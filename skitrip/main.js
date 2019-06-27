

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
            description: 'Kill some time, watch a studio gibli film',
            timing: " Until 7:00am 3rd of July 2019"
        },
        {
            type: 'event',
            title: 'Ski Day 1',
            icon: 'numeric-1',
            timing: "From 7:00am 3rd of July 2019 till 4:00pm",
            description: 'Some ski-trail i am sure'
        },
        {
            type: 'event',
            title: 'Ski Day 2',
            icon: 'numeric-2',
            timing: "From 7:00am 4th of July 2019 till 4:00pm",
            description: 'Some ski-trail i am sure'
        },
        {
            type: 'event',
            title: 'Ski Day 3',
            icon: 'numeric-3',
            timing: "From 7:00am 5th of July 2019 till 4:00pm",
            description: 'Some ski-trail i am sure'
        },
        {
            type: 'event',
            title: 'Ski Day 4',
            icon: 'numeric-4',
            timing: "From 7:00am 6th of July 2019 till 3:00pm",
            description: 'Some ski-trail i am sure'
        },
        {
            type: 'travel',
            title: 'Bus To Sydney',
            icon: 'bus',
            from: {
                time: '5:20 pm',
                date: '6th of July 2019',
                location: 'Bus Bays, National Parks and Wildlife Visitor Centre'
            },
            to: {
                time: '11:55 pm',
                date: '6th of July 2019',
                location: 'Western Forecourt, Bays 5 & 6, Sydney Central'
            }
        },
        {
            type: 'travel',
            title: 'Walk To Hotel',
            icon: 'walk',
            from: {
              time: '11:55 pm',
              date: '6th of July 2019',
              location: 'Central Station',
            },
            to: {
              time: '0:00 am',
              date: '7th of July 2019',
              location: '57 Foveaux St, Surry Hills NSW 2010'
            }
        },
        {
            type: 'event',
            title: 'Sleep',
            icon: 'sleep',
            description: 'TAKE A FUCKEN LOAD OFF BABE!',
            timing: " Until 10:00am 7th of July 2019"
        },
      ]
    },
    methods: {
        openMap(location) {
            location = encodeURIComponent(location)
            const url = `https://maps.google.com/maps?q=${location}`
            window.open(url, '_blank');
        }
    }
  })