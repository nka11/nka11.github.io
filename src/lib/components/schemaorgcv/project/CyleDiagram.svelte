<script lang="ts">
    import type { IProjectCycle } from "$lib/semcv/models";

  // === Données extraites du fichier TTL ===
  const props: {
    phases: IProjectCycle | undefined,
  } = $props()

</script>


<div class="arrow-chart">
  <section class="medium">
    <div class="phase">
        <div class="phase-label">Design</div>
        <div class="phase-description">{props.phases?.design?.value}</div>
    </div>
  </section>
  <section class="low">
    <div class="phase">
        <div class="phase-label">Code</div>
        <div class="phase-description">{props.phases?.code?.value}</div>
    </div>
  </section>
  <section class="high">
    <div class="phase">
        <div class="phase-label">Build</div>
        <div class="phase-description">{props.phases?.build?.value}</div>  
    </div>
  </section>
  <section class="high">
    <div class="phase">
        <div class="phase-label">Delivery</div>
        <div class="phase-description">{props.phases?.delivery?.value}</div>
    </div>
  </section>
  <section class="medium">
    <div class="phase">
        <div class="phase-label">Observability</div>
        <div class="phase-description">{props.phases?.observability?.value}</div>
    </div>
  </section>
  <section class="high">
    <div class="phase">
        <div class="phase-label">Run</div>
        <div class="phase-description">{props.phases?.run?.value}</div>
    </div>
  </section>
</div>

<style>
    /* * {
  
}
html {
  font-family: Sans-Serif;
  font-size: 16px;
} */
.arrow-chart {
    box-sizing: border-box;
  width: 400px;
  height: 400px;
  position: relative;
  text-align: center;
  border-radius: 100%;
  overflow: hidden;
  clip-path: circle(50% at 50% 50%);
/*   -ms-transform: scale(0.35, 0.35);
  -webkit-transform: scale(0.35, 0.35);
  transform: scale(0.35, 0.35); */
}
.arrow-chart:after {
  content: "";
  display: block;
  background: #ffffff;
  width: 50%;
  height: 50%;
  z-index: 10;
  position: absolute;
  border-radius: 100%;
  top: 25%;
  left: 25%;
/*   opacity: .8; */
/*   display: none; */
}

.arrow-chart section {
  height: 48%;
  width: 55%;
  position: absolute;
  text-align: center;
  color: #cccccc;
  background-color: currentColor;
  /* display: flex; */
  align-items: center;
  justify-content: center;
  -webkit-clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
}


.arrow-chart section .phase {
  position: relative;
  width: 50%;
  padding: 0 5%;
  margin: 25% 0 0 0;
  display: block;
  color: #ffffff;
}

.arrow-chart section .phase-label {
  font-size: .9rem;
  font-weight: bold;
}

.arrow-chart section .phase-description {
  font-size: .6rem;
  font-weight: normal;
}



.arrow-chart section:nth-child(1) {
  transform: rotate(0);
  margin-left: 44%;
  margin-top: -12%
}
.arrow-chart section:nth-child(1) .phase {
  transform: rotate(0);
  padding-left: 22%;
  padding-top: 15%;
}
.arrow-chart section:nth-child(2) {
/*   display: none; */
  transform: rotate(60deg);
  margin-left: 66%;
  margin-top: 26%;
}
.arrow-chart section:nth-child(2) .phase {
  transform: rotate(-60deg);
padding-left: 15%;
  padding-top: 28%;
  width: 44%;
}

.arrow-chart section:nth-child(3) {
/*   display: none; */
  transform: rotate(120deg);
  margin-left: 44%;
  margin-top:64%;
}
.arrow-chart section:nth-child(3) .phase {
  transform: rotate(-120deg) ;
}


.arrow-chart section:nth-child(4) {
/*   display:none; */
  transform: rotate(180deg);
  margin-left: .25%;
  margin-top: 64%;
}
.arrow-chart section:nth-child(4) .phase {
  transform: rotate(-180deg);
}


.arrow-chart section:nth-child(5) {
/*   display:none; */
  transform: rotate(240deg);
  margin-left: -21.5%;
  margin-top: 26%;
}
.arrow-chart section:nth-child(5) .phase {
  transform: rotate(-240deg);
}

.arrow-chart section:nth-child(6) {
/*   display:none; */
  transform: rotate(300deg);
  margin-left: 0%;
  margin-top: -12%;
}
.arrow-chart section:nth-child(6) .phase {
  transform: rotate(-300deg);
}


/* Color Palette from https://www.materialui.co/colors */
.high {
  color: #4CAF50!important;
}
.medium {
  color: #FF9800!important;
}
.low {
  color: #FF5722!important;
}
</style>