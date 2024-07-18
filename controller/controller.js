    angular
    .module('myapp', ['ngRoute'])
    .run(function ($rootScope) {
        $rootScope.$on('$rootChangeStart', function () {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$rootChangeSuccess', function () {
            $rootScope.isLoading = false;
        });
        $rootScope.$on('$rootChangeError', function () {
            $rootScope.isLoading = false;
        })
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'view/home.html',
                controller: 'homeCtrl',
            })
            .when('/login', {
                templateUrl: 'view/login.html',
                controller: 'loginCtrl',
            })
            .when('/signin', {
                templateUrl: 'view/signin.html',
                controller: 'signinCtrl',
            })
            .when('/contact', {
                templateUrl: 'view/contact.html',
                controller: 'contactCtrl',
            })
            .when('/search', {
                templateUrl: 'view/search.html',
                controller: 'searchCtrl',
            })
            .when('/faq', {
                templateUrl: 'view/faq.html',
                controller: 'faqCtrl',
            })
            .when('/tour', {
                templateUrl: 'view/tour.html',
                controller: 'tourCtrl',
            })
            .when('/detail/:id', {
                templateUrl: 'view/detail.html',
                controller: 'detailCtrl',
            })
            .when('/cart', {
                templateUrl: 'view/cart.html',
                controller: 'cartCtrl'
            })
            .when('/user', {
                templateUrl: 'view/user.html',
                controller: 'userCtrl'
            })
            .when('/category/:id', {
                templateUrl: 'view/product.html',
                controller: 'categoryCtrl'
            })
            .otherwise({
                template: '<h1>Lỗi không tìm thấy: 404</h1>'
            })
    })
    .controller('homeCtrl', function ($scope, $rootScope) {
        $rootScope.header1 = true;
       
    })
    .filter('search', function () {
        return function (input, keyword, attr) {
            let kq = [];
            if (keyword) {
                keyword = keyword.toLowerCase();
                attr.forEach(attrName => {
                    let tmp = input.filter(item => item[attrName].toString().toLowerCase().indexOf(keyword) >= 0);
                    kq.push(...tmp);
                });
            } else { 
                kq = input; 
            }
            return kq;
        };
    })
    .controller('searchCtrl', function($scope, $location) {
        $scope.submitSearch = function() {
            $location.path('/search').search({ keyword: $scope.searchKeyword });
        };
    })
    
    .controller('contactCtrl', function ($scope, $rootScope) {
        $rootScope.header1 = false;
    })
    .controller('faqCtrl', function ($scope, $rootScope) {
        $rootScope.header1 = false;
    })
    .controller('tourCtrl', function ($scope, $routeParams, $http, $rootScope) {
        $rootScope.header1 = false;
        $scope.id = $routeParams.id;
        $scope.sp = $scope.dsSP.find(i=>i.id==$scope.id);
    })
    .controller("categoryCtrl", function ($scope, $routeParams, $rootScope) {
        $rootScope.header1 = false;
        if ($routeParams.id) {
            var categoryId = $routeParams.id;
            $scope.title = categoryId; 
            $scope.dsSP = $scope.dsSP.filter(function(product) {
                return product.category === categoryId;
            })
        }
        
        $scope.id = $routeParams.id;
        $scope.sp = $scope.dsSP.find(i=>i.id==$scope.id)
    })
    .controller('detailCtrl', function ($scope, $routeParams, $rootScope) {
        $rootScope.header1 = false;
        
        $scope.id = $routeParams.id;
        $scope.sp = $scope.dsSP.find(i=>i.id==$scope.id);

    })
    .controller('loginCtrl', function($scope, $http, $location, $rootScope) {
        $rootScope.header1 = false;
        $scope.isError = false;
    
        $scope.login = function () {
            $http.get('controller/data.json').then(
                function (res) {
                    var users = res.data.user; 

                    var foundUser = users.find(function(user) {
                        return user.email === $scope.email && user.password === $scope.password;
                    });
    
                    if (foundUser) {
                       
                        localStorage.setItem('user', JSON.stringify(foundUser));
                        $location.path('/');
                        alert('Đăng nhập thành công');
                    } else {

                        $scope.isError = true;
                        alert('Đăng nhập không thành công');
                    }
                },
                function (error) {
                   
                    $scope.isError = true;
                }
            );
        };
    
        $scope.logout = function () {
            localStorage.removeItem('user');
            $scope.user = {};
        };
    })
    
    .controller('signinCtrl', function ($scope, $rootScope) {
        $rootScope.header1 = false;
    })
    .controller('userCtrl', function ($scope, $rootScope) {
        $rootScope.header1 = false;
        $scope.users = [
            {
                "id": "1",
                "email": "voduclinh2204@gmail.com",
                "sdt": "03422341234",
                "name": "Võ Đức Linh",
                "adress": "Quận Gò Vấp, HCM",
                "account": "Linh Võ",
                "password": "linhvo989",
                "tour": [
                    {
                        "id": 1,
                        "nametour": "Vịnh Hạ Long",
                        "date": "12-12-2019",
                        "price": "2,500,000",
                        "status": "Đã hoàn thành",
                    },
                    {
                        "id": 2,
                        "nametour": "Vườn quốc gia Phong Nha",
                        "date": "10-11-2020",
                        "price": "3,500,000",
                        "status": "Đã huỷ",
                    },
                    {
                        "id": 3,
                        "nametour": "Sapa",
                        "date": "10-01-2024",
                        "price": "3,900,000",
                        "status": "Đang chờ xác nhận",
                    }
                ]
            }
        ];
    
    })
    .controller('cartCtrl', function ($scope ,$http, $rootScope) {
        $rootScope.header1 = false;
        $scope.trangThai = "Đơn hàng chờ thanh toán";

    })
    .controller('myctrl', function ($scope, $http, $rootScope, $location) {
        $rootScope.header1 = true;
        $scope.dsSP = [];
       
        $http.get('controller/data.json').then(
            function (res) {
                if (res && res.data.products) {
                    $scope.dsSP = res.data.products;
                } else {
                    alert("Dữ liệu trả về từ data.json không hợp lệ hoặc không tồn tại.");
                }
            },function (res) {
                var users = res.data.users;
                var found = users.find(function (user) {
                    return user.email === $scope.email && user.password === $scope.password;
                });
                if (found) {
                    localStorage.setItem('user', JSON.stringify(found));
                    $location.path('/');
                } else {
                    $scope.isError = true;
                }
            },
            function (res) {
                $scope.isError = true;
            }
            ,
            function (res) {
                alert("Lỗi không tải được dữ liệu từ data.json");
            }
        );
        $scope.users = [
            {
              "id": "1",
              "email": "voduclinh2204@gmail.com",
              "sdt": "03422341234",
              "name": "Võ Đức Linh",
              "adress": "Quận Gò Vấp, HCM",
              "account": "Linh Võ",
              "password": "linhvo989",
              "tour": [
                    {
                        "id": 1,
                        "nametour": "Vịnh Hạ Long",
                        "date": "12-12-2019",
                        "price": "2,500,000" ,
                        "status": "Đã hoàn thành" ,
                    },
                    {
                        "id": 2,
                        "nametour": "Vườn quốc gia Phong Nha",
                        "date": "10-11-2020",
                        "price": "3,500,000" ,
                        "status": "Đã huỷ" ,
                    },
                    {
                        "id": 3,
                        "nametour": "Sapa",
                        "date": "10-01-2024",
                        "price": "3,900,000" ,
                        "status": "Đang chờ xác nhận" ,
                    }
                ]
            }
          ];
        
        $scope.cart = [];
        $scope.mua = (sp) => {
            // Chưa có
            if ($scope.cart.filter(i => i.id == sp.id).length == 0) {
                sp.quantity = 1;
                $scope.cart.push(sp);
            }
            // có
            else {
                $scope.cart.forEach(i => {
                    if (i.id == sp.id) {
                        i.quantity++;
                    }
                });
            }
            console.log($scope.cart)
        }
        $scope.tongTien = function () {
            // return $scope.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let sum = 0;
            $scope.cart.forEach(i => {
                sum += Number(i.price) * i.quantity;
            });
            return sum;
        }
        $scope.xoa = function (id) {
            $scope.cart.splice($scope.index,1);
            $scope.clear();
        }
        $scope.check = function () {
            $scope.isEvenNumber = !$scope.myForm.txtNumber.$error.evenNumber;
            $scope.showMessage = true;
          }
       
        

    })
