class CommentsController < ApplicationController
  before_filter :authorize, only: [:edit, :update, :delete]

  #expose(:post)
  expose(:comments, ancestor: :post) { debugger; post.comments }
  expose(:comment)

  def create
    flash[:notice] = "Error creating comment." unless comment.save
    redirect_to post
  end
end
