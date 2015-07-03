function addAlert(type, message, timeout) {
  var alert = $('<div/>')
    .addClass('alert alert-' + type)
    .append('<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    '</button>')
    .append(message)
    .appendTo($('#alerts'))
    .hide()
    .slideDown();
  if (timeout === true) {
    timeout = 2.5;
  }
  if (typeof timeout === 'number') {
    alert
      .delay(timeout * 1000)
      .slideUp()
      .queue(function () {
        $(this).remove();
      });
  }
}

$('#run-section').submit(function () {
  var form = $(this);
  var section = form.find('#section');
  var time = form.find('#time').val();
  if (isNaN(parseFloat(time))) {
    addAlert('warning', 'Enter a valid time', true);
    return false;
  }
  $.ajax('/runFor', {
    method: 'POST',
    data: {
      section: section.val(),
      time: time
    }
  }).done(function () {
    var sectionName = section.find('option:selected').text();
    addAlert('success', 'Running section "' + sectionName + '" for ' + time + ' seconds', true);
  }).fail(function (xhr, status, error) {
    addAlert('danger', 'Failed to run section: ' + error);
  });
  return false;
});

$('#run-program').submit(function () {
  var form = $(this);
  var program = form.find('#program');
  $.ajax('/runProgram', {
    method: 'POST',
    data: {
      program: program.val()
    }
  }).done(function () {
    var programName = program.find('option:selected').text();
    addAlert('success', 'Running program "' + programName + '"', true);
  }).fail(function (xhr, status, error) {
    addAlert('danger', 'Failed to run program: ' + error);
  });
  return false;
});