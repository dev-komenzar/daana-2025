<script lang="ts">
type Properties = {
	color?: string
	marginBottom?: number
	marginTop?: number
}

let { color = 'var(--color-secondary)', marginBottom = 0, marginTop = 0 }: Properties = $props()
</script>

<hr class="divider" style:--margin-top="{marginTop}px" style:--margin-bottom="{marginBottom}px" style:--divider-color={color} />

<style>
.divider {
	width: 100%;
	height: 0;
	margin: var(--margin-top) 0 var(--margin-bottom) 0;
	border: none;
	border-top: 1px dashed var(--divider-color);
}
</style>
