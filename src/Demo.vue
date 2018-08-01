<template>
  <StockContainer>
    <!-- 数据源 -->
    <StockQuery :main="true" :code="code" :unit="unit" :count="count" id="stock_query"></StockQuery>
    <HighAndLowQuery id="highAndLow_query"></HighAndLowQuery>
    <DrawQuery id="draw_query"></DrawQuery>

    <!-- 十字光标 -->
    <StockCrosshair :x="x" :y="y"></StockCrosshair>

    <!-- 蜡烛图 -->
    <StockGrid :width="[]" :height="[]" :padding="{}">
      <CandlestickInfo slot="title" data-ref="stock_query"></CandlestickInfo>
      <CandlestickPlugin data-ref="stock_query"></CandlestickPlugin>
      <AveragePlugin v-for="n in 10" :count="n" data-ref="stock_query"></AveragePlugin>
      <HighAndLowPlugin data-ref="highAndLow_query"></HighAndLowPlugin>
      <BrokenRangePlugin data-ref="stock_query"></BrokenRangePlugin>
      <StockYAxis></StockYAxis>
      <StockYAxis></StockYAxis>
    </StockGrid>

    <!-- 成交量、换手率 -->
    <StockGrid :width="[]" :height="[]" :padding="{}">
      <VolumeInfo slot="title"></VolumeInfo>
      <VolumePlugin></VolumePlugin>
      <VirtualVolumePlugin></VirtualVolumePlugin>
      <StockXAxis></StockXAxis>
      <StockYAxis></StockYAxis>
    </StockGrid>
  </StockContainer>
</template>

<script>
  export default {

  }
</script>
