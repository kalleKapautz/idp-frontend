/**
 * Created by Akash on 5/31/2016.
 */
'use strict';

angular.module('myApp.dashboard')
    .constant('dashboardState', {
        name: 'dashboard.detail',
        options: {
            url: '',
            views: {
                "content@root": {
                    templateUrl: 'views/dashboard/dashboard.html',
                    controller: 'DashboardCtrl'
                }
            },
            ncyBreadcrumb: {
                // a bit ugly (and not stable), but ncybreadcrumbs doesn't support direct access
                // to a view controller yet if there are multiple views
                label: "Dashboard"
            }
        }
    })
    .controller('DashboardCtrl', function($scope, Dashboard, $interval, NgTableParams) {

        var dashboardDetailsPromise =  Dashboard.query(getDashboardDetails);

        function getDashboardDetails() {

            var dashboardDetails = [];

            for(var ctr=0;ctr<dashboardDetailsPromise.length;ctr++){
                dashboardDetails.push(dashboardDetailsPromise[ctr]);
            }

            //$scope.dashboardTable = dashboardDetails;
            //$scope.tableParams = new NgTableParams({}, { dataset: $scope.dashboardTable});
            $scope.tableParams = createUsingFullOptions();

            function createUsingFullOptions() {
                var initialParams = {
                    count: 10 // initial page size
                };
                var initialSettings = {
                    // page size buttons (right set of buttons in demo)
                    counts: [],
                    // determines the pager buttons (left set of buttons in demo)
                    paginationMaxBlocks: 10,
                    paginationMinBlocks: 2,
                    dataset: dashboardDetails
                };
                return new NgTableParams(initialParams, initialSettings);
            }

            var red=0;
            var green=0;
            var orange=0;
            for(var ctr=0;ctr<dashboardDetails.length;ctr++){
                if(dashboardDetails[ctr].carouselStatus==='OK')
                    green++;
                else if(dashboardDetails[ctr].carouselStatus==='WARNING')
                    orange++;
                else if(dashboardDetails[ctr].carouselStatus==='DANGER')
                    red++;
            }

            var pieChartConfig = {
                /*chart: {
                 type: 'bar'
                 },
                 title: {
                 text: 'Stacked bar chart'
                 },
                 xAxis: {
                 categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                 },
                 yAxis: {
                 min: 0,
                 title: {
                 text: 'Total fruit consumption'
                 }
                 },
                 legend: {
                 reversed: true
                 },
                 plotOptions: {
                 series: {
                 stacking: 'normal'
                 }
                 },
                 series: [{
                 name: 'John',
                 data: [5, 3, 4, 7, 2]
                 }, {
                 name: 'Jane',
                 data: [2, 2, 3, 2, 1]
                 }, {
                 name: 'Joe',
                 data: [3, 4, 4, 2, 5]
                 }]*/
                chart: {
                    renderTo: 'container',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Carousel Status'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                    percentageDecimals: 1
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Carousel Status',
                    data: [{
                        name: 'Danger',
                        color: 'lightcoral',
                        y:red,
                        sliced: true
                    }, {
                        name: 'Ok',
                        color: 'lightgreen',
                        y:green,
                        sliced: true
                    }, {
                        name: 'Warning',
                        color: 'lightsalmon',
                        y:orange,
                        sliced: true
                    }]
                }]
            };

            $scope.pieChartConfig = pieChartConfig;

        };

        $interval(function(){
            console.log("Reloading data ...");
            dashboardDetailsPromise =  Dashboard.query(getDashboardDetails);
            getDashboardDetails();
        },50000);

    });
