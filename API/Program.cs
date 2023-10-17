using API.Data;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<Context>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// be able to inject JWTService class inside our Controllers
builder.Services.AddScoped<JWTService>();

// Defining our Identity Service
builder.Services.AddIdentityCore<User>(options =>
{
    // Password configuration
    options.Password.RequiredLength = 6;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;

    // Email Confirmation
    options.SignIn.RequireConfirmedEmail = true;
})
    .AddRoles<IdentityRole>() // be able to add roles
    .AddRoleManager<RoleManager<IdentityRole>>() // be able to make use of RoleManager
    .AddEntityFrameworkStores<Context>() // providing our context
    .AddSignInManager<SignInManager<User>>() // make use of Signin manager
    .AddUserManager<UserManager<User>>() // make use of UserManager to create users
    .AddDefaultTokenProviders(); // be able to create tokens for email conformation

// be able to authenticate users using JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Validate the token based on the key we have provided inside appsetting.development.json JWT:Key
            ValidateIssuerSigningKey = true,
            // the issuer singing key based on JWT:Key
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
            // rhe issuer which is here is the api project url we are using
            ValidIssuer = builder.Configuration["JWT:Key"],
            // validate the issuer (who ever is issuing the JWT)
            ValidateIssuer = true,
            // don't validate audience (Angular side)
            ValidateAudience = false,
        };
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// adding UseAuthentication into our pipeline and this should come before UseAuthorization
// Auhentication verifies the identity of a user or service, and authentication determines their access rights
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
