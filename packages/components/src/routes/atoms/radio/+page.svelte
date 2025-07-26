<div class="container">
  <label>
    <input type="radio" name="radio" />
    Cat
  </label>
  <label>
    <input type="radio" name="radio" />
    Dog
  </label>
  <label>
    <input type="radio" name="radio" />
    Bird
  </label>
  <label>
    <input type="radio" name="radio" />
    Hippopotamus
  </label>
  <label>
    <input type="checkbox" name="check" />
    🐈️
  </label>
  <label>
    <input type="checkbox" name="check" />
    🐕️
  </label>
  <label>
    <input type="checkbox" name="check" />
    🦆
  </label>
  <label>
    <input type="checkbox" name="check" />
    🦛
  </label>
  <label>
    <input type="radio" name="radio" disabled />
    Disabled
  </label>
  <label>
    <input type="checkbox" name="check" disabled />
    Disabled
  </label>
</div>

<style lang="scss">
  .container {
    display: grid;
    grid-template-columns: auto auto;
    gap: 16px;
    max-width: 600px;
    width: fit-content;
    margin: 10vh auto;
  }
</style>
