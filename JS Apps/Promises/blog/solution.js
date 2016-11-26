function addEvents() {
    $(document).ready(function () {

        const kinveyAppId = "kid_S1y-ZY3bx";
        const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
        const kinveyUsername = "peter";
        const kinveyUserPassword = "p";
        const base64auth = btoa(kinveyUsername + ":" + kinveyUserPassword);
        const authHeader = {"Authorization": "Basic " + base64auth};
        $("#btnLoadPosts").click(loadPostsClicked);
        $("#btnViewPost").click(viewPostsClicked);

        function loadPostsClicked() {
            $.ajax({
                url: serviceUrl + "/posts",
                headers: authHeader
            })
                .then(displayPostsInDropdown)
                .catch(displayError)
        }

        function displayPostsInDropdown(posts) {
            $("#posts").empty();
            for (let post of posts) {
                let option = $("<option>");
                option.text(post.title);
                option.val(post._id);
                $('#posts').append(option);
            }
        }

        function displayError(error) {
            let errDiv = $("<div>").text(`Error ${error.status} (${error.statusText})`);
            $(document.body).prepend(errDiv);
            setTimeout(() => {
                errDiv.fadeOut(700, () => errDiv.remove())
            }, 2000)
        }

        function viewPostsClicked() {
            let selectedPostId = $("#posts").val();

            let postRequest = $.ajax({
                method: "GET",
                url: serviceUrl + "/posts/" + selectedPostId,
                headers: authHeader
            });

            let commentsRequest = $.ajax({
                method: "GET",
                url: serviceUrl + `/comments/?query={"post_id":"${selectedPostId}"}`,
                headers: authHeader
            });

            Promise.all([postRequest, commentsRequest])
                .then(displayPostWithComments)
                .catch(displayError);
        }

        function displayPostWithComments([post,comments]) {
            //render title and body
            $("#post-title").text(post.title);
            $("#post-body").text(post.body);

            // render comments
            let commentsDiv = $("#post-comments");
            commentsDiv.empty();
            for (let comment of comments) {
                $("<li>").text(comment.text).appendTo(commentsDiv)
            }
        }

    })}