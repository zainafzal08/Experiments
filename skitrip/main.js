function expandForm(v, points) {
  const results = [];
  for (point of points) {
    results.push(Math.floor(v / point));
    v = v % point;
  }
  results.push(v);
  return results;
}

function secondsToHuman(s) {
  const HOUR = 3600;
  const MINUTE = 60;
  const DAY = HOUR * 24;
  const points = [DAY, HOUR, MINUTE];
  let breakdown = expandForm(s, points);
  r = breakdown.map((x) => Math.floor(x)).map((x) => (x < 10 ? "0" + x : x));
  return `${r[0]} : ${r[1]} : ${r[2]} : ${r[3]}`;
}

const vm = new Vue({
  el: "#app",
  data: {
    timers: {},
    items: [
      {
        title: "Location 1",
        starttimestamp: 1667120653,
        endtimestamp: 1667120654,
        description: "I am a description",
        type: "travel",
        from: {
          time: "4:00pm",
          date: "Sunday 30th October",
          location: "Home",
        },
        to: {
          time: "8:00pm",
          date: "Sunday 30th October",
          location: "Canberra",
        },
      },
      {
        title: "Location 2",
        starttimestamp: 1667120660,
        endtimestamp: 1667120660 + 3600 * 2,
        description: "I am a description",
        type: "travel",
        from: {
          time: "9:00am",
          date: "Monday 31st October",
          location: "Canberra",
        },
        to: {
          time: "10:00am",
          date: "Monday 31st October",
          location: "Event Space",
        },
      },
      {
        title: "Location 3",
        starttimestamp: 1668240520 + 3600 * 24 * 4,
        endtimestamp: 1668240520 + 3600 * 24,
        description: "I am a description",
        type: "countdown",
      },
    ],
  },
  methods: {
    openMap(location) {
      location = encodeURIComponent(location);
      const url = `https://maps.google.com/maps?q=${location}`;
      window.open(url, "_blank");
    },
    getState(item) {
      const now = Date.now() / 1000;
      if (now < item.starttimestamp) return "to-come";
      if (now >= item.starttimestamp && now <= item.endtimestamp)
        return "on-going";
      if (now > item.endtimestamp) return "done";
    },
    human(t) {
      const now = Date.now() / 1000;
      if (t === undefined || t <= now) return "00:00:00:00";
      t = t - now;
      return secondsToHuman(t);
    },
    progress(item) {
      const now = Date.now() / 1000;
      const dist = now - item.starttimestamp;
      const total = item.endtimestamp - item.starttimestamp;
      // will be too many decimal places but eh
      const p = (dist / total) * 100;
      return p + "%";
    },
  },
  mounted() {
    // Sorry vue gods
    // This forces the entire page to rerender every 500ms
    setInterval(() => {
      this.items = [...this.items];
    }, 500);
  },
});
