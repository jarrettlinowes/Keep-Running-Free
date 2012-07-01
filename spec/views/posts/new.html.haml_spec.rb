require 'spec_helper'

describe "posts/new" do
  before(:each) do
    assign(:post, stub_model(Post,
      :title => "MyString",
      :intro => "MyText",
      :body => "MyText",
      :status => "MyString",
      :author_id => 1
    ).as_new_record)
  end

  it "renders new post form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => posts_path, :method => "post" do
      assert_select "input#post_title", :name => "post[title]"
      assert_select "textarea#post_intro", :name => "post[intro]"
      assert_select "textarea#post_body", :name => "post[body]"
      assert_select "input#post_status", :name => "post[status]"
      assert_select "input#post_author_id", :name => "post[author_id]"
    end
  end
end
