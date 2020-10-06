export default () => `
<form id="register" method="POST" action="">
  <div>
    <label for="username">Username:</label>
    <input type="text" name="username" id="username" placeholder="Url">
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="text" name="password" id="password">
  </div>
  <input type="submit" name="register" value="Click here">
</form>`;
