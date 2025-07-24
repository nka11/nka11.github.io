<script lang="ts">
    import CalPopup from "$lib/components/CalPopup.svelte";


</script>

<CalPopup namespace="meeting-30min"/>
    <button
        data-cal-link="nico-deepthought/30min"
        data-cal-namespace="meeting-30min"
        class="calcom-button"
        >
        Book a Meeting
</button>

<style>
.calcom-button {
  padding-left: 1.5rem;  /* px-6 */
  padding-right: 1.5rem;
  padding-top: 0.75rem;  /* py-3 */
  padding-bottom: 0.75rem;
  background-color: #ffffff; /* bg-blue-600 */
  color: #494949;            /* text-white */
  border: none;
}

.calcom-button:hover {
    color: #121212;
    /* font-weight: bold; */
}
</style>