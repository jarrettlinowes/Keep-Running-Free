class ApplicationController < ActionController::Base
	protect_from_forgery

  protected

	def current_user
		@current_user ||= User.find(session[:user_id]) if session[:user_id]
	end
	helper_method :current_user

	def authorize
		redirect_to root_url, alert: "Not authorized" if current_user.nil?
	end

  # def ckeditor_filebrowser_scope(options = {})
  #   super({ :assetable_id => current_post.id, :assetable_type => 'Post' }.merge(options))
  # end

end
