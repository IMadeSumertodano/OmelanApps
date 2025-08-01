const { badRequest, internal } = require('@hapi/boom');
const template = require('../../utils/notificationTemplate');

class ReviewHandler {
  constructor(appointmentService, service, validator) {
    this._appointmentService = appointmentService;
    this._service = service;
    this._validator = validator;
  }

  getClientReviewSummaryHandler = async (request, h) => {
    try {
      const { id: userClientId } = request.auth.credentials;
      const reviews = await this._service.getClientReviewSummary(userClientId);

      return h
        .response({
          status: 'success',
          data: { reviews },
        })
        .code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return badRequest(error.message);
    }
  };

  patchReviewHandler = async (request, h) => {
    try {
      this._validator.validateReviewPayload(request.payload);

      const { appointmentId, rating, comment } = request.payload;
      await this._service.updateReview({ appointmentId, rating, comment });

      const appointment = await this._appointmentService.getAppointmentByIdForReview(appointmentId);
      const userPartnerId = appointment.user_partner_id;

      const { subject, content } = template().createReviewNotificationForPartner;
      await this._notificationPartnerService.addNotification({ userPartnerId, subject, content });

      return h
        .response({
          status: 'success',
          message: 'Review berhasil diperbarui',
        })
        .code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return badRequest(error.message);
    }
  };

  getReviewHandler = async (request, h) => {
    try {
      const { id: userPartnerId } = request.auth.credentials;
      const reviews = await this._service.getReviewsByUserPartnerId(userPartnerId);

      return h
        .response({
          status: 'success',
          data: { reviews },
        })
        .code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return internal(error.message);
    }
  };
}

module.exports = ReviewHandler;
