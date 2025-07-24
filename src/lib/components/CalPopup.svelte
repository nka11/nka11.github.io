<script lang="ts">
  import { onMount } from 'svelte';

  let cal: any;

  onMount(() => {
    (function (C, A, L) {
      let p = function (a, ar) {
        a.q.push(ar);
      };
      let d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.loaded = true;
            let scr = d.createElement('script');
            scr.type = 'text/javascript';
            scr.async = true;
            scr.src = A;
            let s = d.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(scr, s);
          }
          return p(cal, ar);
        };
      C.Cal.q = C.Cal.q || [];
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    Cal('init', {
      origin: 'https://app.cal.com',
    });

    Cal('ui', {
      styles: {
        branding: {
          brandColor: '#000000',
        },
      },
      hideEventTypeDetails: false,
    });
  });

  function showCalPopup() {
    Cal('popup', {
      calLink: 'karac-s-engineering-group/30min',
      config: {
        layout: 'month_view',
      },
    });
  }
</script>

<button on:click={showCalPopup}>Book a meeting</button>
