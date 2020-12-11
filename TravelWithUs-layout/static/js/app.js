;$(function(){
	var init = function (){
		initBuyBtn();
		$('#addToCart').click(addTourToCart);
		$('#addTourPopup .count').change(calculateCost);
		$('#loadMore').click(loadMoreTours);
		initSearchForm();
		$('#goSearch').click(goSearch);
		$('.remove-tour').click(removeTourFromCart);
	};

	var showAddTourPopup = function (){
		var idTour = $(this).attr('data-id-tour');
		var tour = $('#tour'+idTour);
		$('#addTourPopup').attr('data-id-tour', idTour);
		$('#addTourPopup .tour-image').attr('src', tour.find('.card img').attr('src'));
		$('#addTourPopup .name').text(tour.find('.name').text());
		var price = tour.find('.price').text();
		$('#addTourPopup .price').text(price);
		$('#addTourPopup .country').text(tour.find('.country').text());
		$('#addTourPopup .city').text(tour.find('.city').text());
		$('#addTourPopup .count').val(1);
		$('#addTourPopup .cost').text(price);
		$('#addToCart').removeClass('hidden');
		$('#addToCartIndicator').addClass('hidden');
		$('#addTourPopup').modal({
			show:true
		});
	};
	var initBuyBtn = function(){
		$('.buy-btn').click(showAddTourPopup);
	};
	var addTourToCart = function (){
		var idTour = $('#addTourPopup').attr('data-id-tour');
		var count = $('#addTourPopup .count').val();
		$('#addToCart').addClass('hidden');
		$('#addToCartIndicator').removeClass('hidden');
		setTimeout(function(){
			var data = {
				totalCount : count,
				totalCost : 2000
			};
			$('#currentShoppingCart .total-count').text(data.totalCount);
			$('#currentShoppingCart .total-cost').text(data.totalCost);
			$('#currentShoppingCart').removeClass('hidden');
			$('#addTourPopup').modal('hide');
		}, 800);
	};
	var calculateCost = function(){
		var priceStr = $('#addTourPopup .price').text();
		var price = parseFloat(priceStr.replace('$',' '));
		var count = parseInt($('#addTourPopup .count').val());
		var min = parseInt($('#addTourPopup .count').attr('min'));
		var max = parseInt($('#addTourPopup .count').attr('max'));
		if(count >= min && count <= max) {
			var cost = price * count;
			$('#addTourPopup .cost').text('$ '+cost);
		} else {
			$('#addTourPopup .count').val(1);
			$('#addTourPopup .cost').text(priceStr);
		}
	};
	var loadMoreTours = function (){
		$('#loadMore').addClass('hidden');
		$('#loadMoreIndicator').removeClass('hidden');
		setTimeout(function(){
			$('#loadMoreIndicator').addClass('hidden');
			$('#loadMore').removeClass('hidden');
		}, 800);
	};
	var initSearchForm = function (){
		$('#allCountries').click(function(){
			$('.countries .search-option').prop('checked', $(this).is(':checked'));
		});
		$('.countries .search-option').click(function(){
			$('#allCountries').prop('checked', false);
		});
		$('#allCities').click(function(){
			$('.cities .search-option').prop('checked', $(this).is(':checked'));
		});
		$('.cities .search-option').click(function(){
			$('#allCities').prop('checked', false);
		});
	};
	var goSearch = function(){
		var isAllSelected = function(selector) {
			var unchecked = 0;
			$(selector).each(function(index, value) {
				if(!$(value).is(':checked')) {
					unchecked ++;
				}
			});
			return unchecked === 0;
		};
		if(isAllSelected('.countries .search-option')) {
			$('.countries .search-option').prop('checked', false);
		}
		if(isAllSelected('.cities .search-option')) {
			$('.cities .search-option').prop('checked', false);
		}
		$('form.search').submit();
	};
	var confirm = function (msg, okFunction) {
		if(window.confirm(msg)) {
			okFunction();
		}
	};
	var removeTourFromCart = function (){
		var btn = $(this);
		confirm('Are you sure?', function(){
			executeRemoveTour(btn);
		});
	};
	var refreshTotalCost = function () {
		var total = 0;
		$('#shoppingCart .item').each(function(index, value) {
			var count = parseInt($(value).find('.count').text());
			var price = parseFloat($(value).find('.price').text().replace('$', ' '));
			var val = price * count;
			total = total + val;
		});
		$('#shoppingCart .total').text('$'+total);
	};
	var executeRemoveTour = function (btn) {
		var idTour = btn.attr('data-id-tour');
		var count = btn.attr('data-count');
		btn.removeClass('btn-primary');
		btn.removeClass('btn');
		btn.addClass('load-indicator');
		var text = btn.text();
		btn.text('');
		btn.off('click');

		setTimeout(function(){
			var data = {
				totalCount : 1,
				totalCost : 1
			};
			if(data.totalCount === 0) {
				window.location.href = 'tours.html';
			} else {
				var prevCount = parseInt($('#tour'+idTour+' .count').text());
				var remCount = parseInt(count);
				if(remCount === prevCount) {
					$('#tour'+idTour).remove();

					//
					if($('#shoppingCart .item').length === 0) {
						window.location.href = 'tours.html';
					}
					//
				} else {
					btn.removeClass('load-indicator');
					btn.addClass('btn-primary');
					btn.addClass('btn');
					btn.text(text);
					btn.click(removeTourFromCart);
					$('#tour'+idTour+' .count').text(prevCount - remCount);
					if(prevCount - remCount == 1) {
						$('#tour'+idTour+' a.remove-tour.all').remove();
					}
				}
				refreshTotalCost();
			}
		}, 1000);
	}

	init();
});