global.baseUrl = "http://localhost:9000";
beforeEach(function () {
	// Login by adding user obj and token to local storage
	localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"user_A\", \"isAdmin\": \"false\", \"name\": \"user_A\"}')
  localStorage.setItem('satellizer_token', 'imamafakedockstoretoken')
});
