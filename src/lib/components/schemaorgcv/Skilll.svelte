<script lang="ts">
  import type { ISkillsDetails } from '$lib/semcv/models';
  export let skill: ISkillsDetails;
    export let color: 'default' | 'info' | 'success' | 'warning' | 'danger' = 'default';

  const colorClasses = {
    default: 'bg-slate-100 text-slate-800',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };
</script>

<span
  class={`text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-full ${colorClasses[color]}`}
>
  {skill.skillLabel?.value}
</span>