<script lang="ts">
    import CalPopup from "$lib/components/CalPopup.svelte";
    import { T } from '$lib/i18n';
</script>

<CalPopup namespace="meeting-30min" calLink="nico-deepthought/30min"/>
    <button
        data-cal-link="nico-deepthought/30min"
        data-cal-namespace="meeting-30min"
        class="calcom-button"
        >
        {$T('book_a_meeting')}
</button>

<style>
.calcom-button {
  padding: 0.45rem 1rem;
  background-color: var(--ink);
  color: var(--paper);
  border: 1px solid var(--ink);
  border-radius: var(--radius-1, 2px);
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.calcom-button:hover {
    background-color: var(--or);
    border-color: var(--or);
    color: var(--ink);
}
</style>