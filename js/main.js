
function cuteformType(value, _) {
    return static_url + 'img/color/' + value + '.png';
}

// Called by profile.js + ownedcards.js
function updateOwnedCards() {
    $('.ownedcard').each(function() {
	$(this).popover({
	    'container': 'body',
	    'trigger': 'click',
	    'title': $(this).data('card-title'),
	    'content': $(this).find('.hidden').html(),
	    'html': true,
	    'placement': 'bottom',
	});
    });
    $('.ownedcard').on('shown.bs.popover', function() {
	ajaxModals();
	$('.popover a').click(function(e) {
	    hidePopovers();
	    $('.ownedcard').popover('hide');
	});
    });
}

function reloadOwnedCardsAfterModal(on_profile) {
    on_profile = typeof on_profile == 'undefined' ? true : on_profile;
    if (is_authenticated) {
	$('#freeModal').on('hidden.bs.modal', function () {
	    if (ownedcards_to_reload.length > 0) {
		$.get('/ajax/ownedcards/?ids=' + ownedcards_to_reload.join(',') + '&page_size=' + ownedcards_to_reload.length, function(data) {
		    var html = $(data);
		    // Remove all that weren't returned
		    $.each(ownedcards_to_reload, function(_, id) {
			if (html.find('[data-ownedcard-id="' + id + '"]').length == 0) {
			    $('[data-ownedcard-id="' + id + '"]').after('<br><br><span class="text-muted">' + gettext('Deleted') + '</span><br><br>');
			    $('[data-ownedcard-id="' + id + '"]').remove();
			}
		    });
		    html.find('.ownedcard').each(function() {
			var newOwnedcardItem = $(this);
			var ownedcardItem;
			if (on_profile) {
			    ownedcardItem = $('.profile-account #' + newOwnedcardItem.prop('id'));
			} else {
			    ownedcardItem = $('.current-ownedcard_list #' + newOwnedcardItem.prop('id'));
			}
			if (ownedcardItem.length > 0) {
			    // Replace existing
			    ownedcardItem.html(newOwnedcardItem.html());
			} else {
			    // Add at the end
			    var account_id = newOwnedcardItem.data('ownedcard-account-id');
			    var newElement = $('<div class="col-sm-3"></div>');
			    newElement.html(newOwnedcardItem);
			    $('#account' + account_id + 'Cards .row').last().append(newElement);
			}
		    });
		    ownedcards_to_reload = [];
		    updateOwnedCards();
		});
	    }
	})
    }
}

$(document).ready(function() {
    $('#freeModal').on('show.bs.modal', function() {
	$('main [data-toggle="tooltip"]').tooltip('hide');
	$('main [data-toggle="popover"]').popover('hide');
	$('main .ownedcard').popover('hide');
    });
    $('#freeModal').on('hide.bs.modal', function() {
	$('#freeModal .ownedcard').popover('hide');
    });
    // Dismiss owned cards popover on click anywhere else
    $('body').on('click', function (e) {
	if (!$(e.target).hasClass('ownedcard')
	    && !(e.target).closest('.ownedcard')
	    && $(e.target).parents('.popover.in').length === 0
	   ) {
	    $('.ownedcard').popover('hide');
	}
    });
});
