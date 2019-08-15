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
          const now = Date.now()
          if (t === undefined || t <= now) return "00:00:00:00"
          t = t - now
          return secondsToHuman(t/1000);
        },
        progress(item) {
          const now = Date.now()
          const dist = now - item.starttimestamp
          const total = item.endtimestamp - item.starttimestamp
          // will be too many decimal places but eh
          const p = (dist/total)*100
          return p + "%"
        }
    },
    mounted() {
      // Sorry vue gods
      // This forces the entire page to rerender every 500ms
      setInterval(() => {
        this.items = [...this.items]
      }, 500);
    }
  })