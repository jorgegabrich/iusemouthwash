(function(){
    var app = angular.module('mouthwash',['ngRoute','ngTouch','truncate']);
    
    app.config(function($routeProvider,$locationProvider){
        $routeProvider
            .when('/',{
                templateUrl : 'p/posts.html',
                controller  : 'PostController'            
            })
            .when('/settings',{
                templateUrl : 'pages/settings.html',
                controller  : 'SettingsController'            
            })
            .when('/about',{
                templateUrl : 'pages/about.html',
                controller  : 'AboutController'            
            })
            .when('/profile/:user',{
                templateUrl : 'pages/profile.html',
                controller  : 'ProfileController'            
            })
            .when('/articles/:any*', { 
                templateUrl: function(params){ 
                return '/articles/'+params.any+'/index.html'; 
            },
            controller: 'PostController' })
            .otherwise({redirectTo: '/'});
        
    });

    app.controller('PostController',  function($scope, postService){
                
        
        $scope.edit_button = "mode_edit";
        $scope.postData = [];
        $scope.commentsData = [];
        //Open Post Modal
        $scope.openPostModal = function (postScope) {
            $('.modal-row .card-image').hide();
            $('.modal-row .card-description').hide();
            $('.modal-row .card-url').hide();
            $('.modal-row').scope().pl = [];
            $('.modal-row').scope().pl = postScope.pl;
            loadRemoteComments(postScope.pl.id);
            console.log($scope.commentsData);
            if(postScope.pl.hasOwnProperty('description')){
                $('.modal-row .card-description').show();
            }
            if(postScope.pl.hasOwnProperty('images')){
                $('.modal-row .card-image').show();
            }
            if(postScope.pl.hasOwnProperty('url')){
                $('.modal-row .card-url').show();
            }
            $('#modalPostList').openModal(); 
        };
        //Load Posts            
        loadRemotePosts();
        
        function applyRemotePosts( posts ) {
            $scope.postData = posts;
        } 
                
        function loadRemotePosts() {
            postService.getPosts()
                .then(
                    function( posts ) {
                        applyRemotePosts( posts );
                    }
                )
            ;
        }
         
        
        
        function applyRemoteComments( comments ) {
            $scope.commentsData = comments;
        } 
                
        function loadRemoteComments(postId) {
            postService.getComments(postId)
                .then(
                    function( comments ) {
                        
                        applyRemoteComments( comments );
                    }
                )
            ;
        }
        
    });
    
    app.controller('SettingsController', function(){
        
    });
    
    app.controller('AboutController', function(){
        
    });
    
    app.controller('ProfileController', function($scope, profileService, $routeParams){
        $scope.edit_button = "mode_edit";
        $scope.userPosts = [];
        $scope.commentsData = [];
        $scope.userData = [];
        $scope.user = $routeParams.user;
        console.log($scope.user);
        //Open Post Modal
        $scope.openPostModal = function (postScope) {
            $('.modal-row .card-image').hide();
            $('.modal-row .card-description').hide();
            $('.modal-row .card-url').hide();
            $('.modal-row').scope().pl = [];
            $('.modal-row').scope().pl = postScope.pl;
            loadRemoteComments(postScope.pl.id);
            console.log($scope.commentsData);
            if(postScope.pl.hasOwnProperty('description')){
                $('.modal-row .card-description').show();
            }
            if(postScope.pl.hasOwnProperty('images')){
                $('.modal-row .card-image').show();
            }
            if(postScope.pl.hasOwnProperty('url')){
                $('.modal-row .card-url').show();
            }
            $('#modalPostList').openModal(); 
        };
        //Load Posts            
        loadRemotePosts($scope.user);
        
        function applyRemotePosts( posts ) {
            $scope.userPosts = posts;
        } 
                
        function loadRemotePosts(user) {
            console.log(user);
            profileService.getPosts(user)
                .then(
                    function( posts ) {
                        applyRemotePosts( posts );
                    }
                )
            ;
        }
        loadRemoteUser($scope.user);
        
        function applyRemoteUser( user ) {
            $scope.userData = user;
          
        } 
                
        function loadRemoteUser(user) {
            profileService.getProfile(user)
                .then(
                    function( data ) {
                        applyRemoteUser( data );
                    }
                )
            ;
        } 
        
        
        function applyRemoteComments( comments ) {
            $scope.commentsData = comments;
        } 
                
        function loadRemoteComments(postId) {
            profileService.getComments(postId)
                .then(
                    function( comments ) {
                        
                        applyRemoteComments( comments );
                    }
                )
            ;
        }
    });
    
    app.directive("ngcModalReply", function(){
        
        function link(scope,element,attrs){
            element.click(function(){
               if($(this).children('.comment-reply').is(':hidden')){
                   $('.comment-reply').slideUp();
                   $(this).children('.comment-reply').slideDown();    
               }
            });
            
        }
        return{
            link: link
        };
        
    });
    /*
    app.directive("ngcPostList", function(){
        return{
            scope: {pl: "=post"},
            templateUrl: 'templates/post_list.html',
            link: function(scope,element,attrs){
                console.log(scope.pl);
            }
        }
        
    });*/
        
    app.directive("ngcButtonToggle", function(){
        function link(scope,element,attrs){
            element.click(function(){
               $(this).html($(this).html() == 'mode_edit' ? 'clear' : 'mode_edit');  
                          
            });
            
        }
        return{
            link: link
        };
    });
    
    app.service(
            "postService",
            function( $http, $q ) {
                // Return public API.
                return({
                    getPosts: getPosts
                                        
                });
                
                
                function getPosts() {
                    var request = $http({
                        method: "get",
                        url: "/articles/index.json",
                        params: {
                            action: "getPosts"
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                             
                function handleError( response ) {
                    
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    
                    return( $q.reject( response.data.message ) );
                }
                
                function handleSuccess( response ) {
                    return( response.data );
                }
            }
    );
        
    

})();