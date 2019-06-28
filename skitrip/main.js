function expandForm(v,points) {
  const results = []
  for (point of points) {
      results.push(Math.floor(v/point));
      v = v % point;
  }
  results.push(v);
  return results;  
}

function secondsToHuman(s) {
  const HOUR = 3600;
  const MINUTE = 60;
  const DAY = HOUR*24;
  const points = [DAY,HOUR,MINUTE];
  let breakdown = expandForm(s,points);
  r = breakdown.map(x => Math.floor(x)).map(x => x < 10 ? '0'+x : x)
  return `${r[0]} : ${r[1]} : ${r[2]} : ${r[3]}`
}

const vm = new Vue({
    el: '#app',
    data: {
      timers: {},
      items: [
        {
          id: 0,
          type: 'countdown',
          title: 'Time Left Until We Go!',
          icon: 'timer-sand-empty',
          starttimestamp: (new Date('July 2, 2019 7:00:00')).getTime(),
          endtimestamp: (new Date('July 2, 2019 7:00:00')).getTime(),
        },
        {
          id: 1,
          type: 'travel',
          title: 'Bus To Jindabyne',
          icon: 'bus',
          starttimestamp: (new Date('July 2, 2019 7:00:00')).getTime(),
          endtimestamp: (new Date('July 2, 2019 13:45:00')).getTime(),
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
          id: 2,
          type: 'travel',
          title: 'Walk To Hotel',
          icon: 'walk',
          starttimestamp: (new Date('July 2, 2019 13:45:00')).getTime(),
          endtimestamp: (new Date('July 2, 2019 14:00:00')).getTime(),
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
          id: 3,
          type: 'event',
          title: 'Chill Sesh 1',
          icon: 'sleep',
          starttimestamp: (new Date('July 2, 2019 14:00:00')).getTime(),
          endtimestamp: (new Date('July 3, 2019 7:00:00')).getTime(),
          description: 'Kill some time, watch a studio gibli film',
          timing: " Until 7:00am 3rd of July 2019"
        },
        {
          type: 'event',
          title: 'Ski Day 1',
          icon: 'numeric-1',
          starttimestamp: (new Date('July 3, 2019 7:00:00')).getTime(),
          endtimestamp: (new Date('July 3, 2019 16:00:00')).getTime(),
          timing: "From 7:00am 3rd of July 2019 till 4:00pm",
          description: 'Some ski-trail i am sure'
        },
        {
          id: 4,
          type: 'event',
          title: 'Chill Sesh 2',
          icon: 'sleep',
          starttimestamp: (new Date('July 3, 2019 16:00:00')).getTime(),
          endtimestamp: (new Date('July 4, 2019 7:00:00')).getTime(),
          description: 'Dunno what we got planned but we got some time bitch',
          timing: "Until 7:00am 4th of July 2019"
        },
        {
          id: 5,
          type: 'event',
          title: 'Ski Day 2',
          icon: 'numeric-2',
          starttimestamp: (new Date('July 4, 2019 7:00:00')).getTime(),
          endtimestamp: (new Date('July 4, 2019 16:00:00')).getTime(),
          timing: "From 7:00am 4th of July 2019 till 4:00pm",
          description: 'Some ski-trail i am sure'
        },
        {
          id: 6,
          type: 'event',
          title: 'Chill Sesh 3',
          icon: 'sleep',
          starttimestamp: (new Date('July 4, 2019 16:00:00')).getTime(),
          endtimestamp: (new Date('July 5, 2019 7:00:00')).getTime(),
          description: 'Dunno what we got planned but we got some time bitch',
          timing: "Until 7:00am 5th of July 2019"
        },
        {
          id: 7,
          type: 'event',
          title: 'Ski Day 3',
          icon: 'numeric-3',
          starttimestamp: (new Date('July 5, 2019 7:00:00')).getTime(),
          endtimestamp: (new Date('July 5, 2019 16:00:00')).getTime(),
          timing: "From 7:00am 5th of July 2019 till 4:00pm",
          description: 'Some ski-trail i am sure'
        },
        {
          id: 8,
          type: 'event',
          title: 'Chill Sesh 4',
          icon: 'sleep',
          starttimestamp: (new Date('July 5, 2019 16:00:00')).getTime(),
          endtimestamp: (new Date('July 6, 2019 7:00:00')).getTime(),
          description: 'Dunno what we got planned but we got some time bitch',
          timing: "Until 7:00am 6th of July 2019"
        },
        {
          id: 9,
          type: 'event',
          title: 'Ski Day 4',
          icon: 'numeric-4',
          starttimestamp: (new Date('July 6, 2019 7:00:00')).getTime(),
          endtimestamp: (new Date('July 6, 2019 16:00:00')).getTime(),
          timing: "From 7:00am 6th of July 2019 till 4:00pm",
          description: 'Last day! :('
        },
        {
          id: 10,
          type: 'event',
          title: 'Check out',
          icon: 'exit-to-app',
          starttimestamp: (new Date('July 6, 2019 16:00:00')).getTime(),
          endtimestamp: (new Date('July 6, 2019 17:20:00')).getTime(),
          description: 'Goodbye motherfucker',
          timing: "Until 5:20pm 7th of July 2019"
        },
        {
          id: 11,
          type: 'travel',
          title: 'Bus To Sydney',
          icon: 'bus',
          starttimestamp: (new Date('July 6, 2019 17:20:00')).getTime(),
          endtimestamp: (new Date('July 6, 2019 23:55:00')).getTime(),
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
          id: 12,
          type: 'travel',
          title: 'Walk To Hotel',
          icon: 'walk',
          starttimestamp: (new Date('July 6, 2019 23:55:00')).getTime(),
          endtimestamp: (new Date('July 7, 2019 00:00:00')).getTime(),
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
          id: 13,
          type: 'event',
          title: 'Sleep',
          icon: 'sleep',
          starttimestamp: (new Date('July 7, 2019 0:00:00')).getTime(),
          endtimestamp: (new Date('July 7, 2019 10:00:00')).getTime(),
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
        },
        getState(item) {
          const now = Date.now()
          if (now < item.starttimestamp) return "to-come"
          if (now >= item.starttimestamp && now <= item.endtimestamp) return "on-going"
          if (now > item.endtimestamp) return "done"
        },
        human(t) {
          if (t === undefined) return "00:00:00:00"
          return secondsToHuman(t/1000);
        }
    },
    mounted() {
      this.items
        .filter(x => x.type === 'countdown')
        .filter(x => x.starttimestamp > Date.now())
        .map(x=>{
          setInterval(()=>{
            const newTimers = {...this.timers}
            newTimers[x.id] = x.starttimestamp - Date.now()
            this.timers = newTimers
          }, 500)
        })
    }
  })