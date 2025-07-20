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
<style>
  .skill-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    margin: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    transition: all 0.2s ease-in-out;
  }

  .skill-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

    /* Color modifiers */
  .skill-tag--default {
    background-color: #f1f5f9;
    color: #1e293b;
  }

  .skill-tag--info {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .skill-tag--success {
    background-color: #d1fae5;
    color: #065f46;
  }

  .skill-tag--warning {
    background-color: #fef9c3;
    color: #92400e;
  }

  .skill-tag--danger {
    background-color: #fee2e2;
    color: #991b1b;
  }
</style>
<span
  class="skill-tag skill-tag--{color}"
>
  {skill.skillLabel?.value}
</span>